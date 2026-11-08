import test from 'node:test';
import assert from 'node:assert/strict';
import { isRegularClinicClosedDay, isClinicClosedDay, CLINIC_DATED_HOURS, upcomingClinicClosedDates } from '../src/lib/clinic.ts';
import { computeStatus } from '../src/lib/clinic-status.ts';
import { clinicNode } from '../src/lib/schema.ts';

test('둘째·넷째 수요일만 정기 휴진이며 잘못된 날짜를 거부한다', () => {
  for (const date of ['2026-11-11', '2026-11-25', '2027-02-10', '2027-02-24']) assert.equal(isRegularClinicClosedDay(date), true, date);
  for (const date of ['2026-11-04', '2026-11-18', '2026-12-30', '2026-11-12', '2026-02-30', 'invalid']) assert.equal(isRegularClinicClosedDay(date), false, date);
});
test('휴진일은 오전·점심·오후 모두 닫힘이며 전날에는 휴진일을 건너뛴다', () => {
  for (const day of [11, 25]) for (const hour of ['00', '09', '11', '13', '19']) {
    const status = computeStatus(new Date(`2026-11-${day}T${hour}:30:00+09:00`));
    assert.equal(status.open, false);
    assert.match(status.label, /정기 휴진/);
  }
  assert.match(computeStatus(new Date('2026-11-10T20:30:00+09:00')).label, /목요일 10:00/);
  assert.match(computeStatus(new Date('2026-11-10T15:00:00Z')).label, /정기 휴진/);
});
test('일반 수요일·점심·주말·공휴일·명절 진료시간은 유지한다', () => {
  assert.equal(computeStatus(new Date('2026-11-18T11:00:00+09:00')).open, true);
  assert.match(computeStatus(new Date('2026-11-18T13:30:00+09:00')).label, /점심시간/);
  assert.equal(computeStatus(new Date('2026-11-08T13:30:00+09:00')).open, true);
  assert.equal(computeStatus(new Date('2026-12-25T15:59:00+09:00')).open, true);
  assert.equal(computeStatus(new Date('2026-12-25T16:00:00+09:00')).open, false);
  assert.equal(isClinicClosedDay('2026-09-25'), true);
});
test('날짜별 스키마에 월 2회 휴진이 들어가고 날짜가 중복되지 않는다', () => {
  const specs = clinicNode().openingHoursSpecification.filter(s => s.validFrom);
  assert.equal(new Set(specs.map(s => s.validFrom)).size, specs.length);
  for (const year of [2026, 2027]) {
    const regular = CLINIC_DATED_HOURS.filter(d => d.date.startsWith(String(year)) && isRegularClinicClosedDay(d.date));
    assert.equal(regular.length, 24);
    for (const day of regular) {
      const spec = specs.find(s => s.validFrom === day.date);
      assert.equal(spec.opens, '00:00'); assert.equal(spec.closes, '00:00');
    }
  }
  assert.equal(specs.filter(s => s.validFrom === '2027-10-13').length, 1);
  assert.deepEqual(upcomingClinicClosedDates(new Date('2026-11-08T00:00:00+09:00')).slice(0, 2), ['2026-11-11', '2026-11-25']);
  assert.equal(upcomingClinicClosedDates(new Date('2026-11-11T15:00:00Z'))[0], '2026-11-25');
});
