import test from 'node:test';
import assert from 'node:assert/strict';
import { CLINIC_CLOSED_HOLIDAYS, isRegularClinicClosedDay, isClinicClosedDay, CLINIC_DATED_HOURS, upcomingClinicClosedDates, upcomingClinicHolidaySchedules } from '../src/lib/clinic.ts';
import { computeStatus } from '../src/lib/clinic-status.ts';
import { clinicNode } from '../src/lib/schema.ts';

test('둘째·넷째 수요일만 정기 휴진이며 잘못된 날짜를 거부한다', () => {
  for (const date of ['2026-11-11', '2026-11-25', '2027-02-24']) assert.equal(isRegularClinicClosedDay(date), true, date);
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
test('날짜별 스키마는 실제 정기휴진일만 포함하고 날짜가 중복되지 않는다', () => {
  const specs = clinicNode().openingHoursSpecification.filter(s => s.validFrom);
  assert.equal(new Set(specs.map(s => s.validFrom)).size, specs.length);
  for (const year of [2026, 2027]) {
    const regular = CLINIC_DATED_HOURS.filter(d => d.date.startsWith(String(year)) && isRegularClinicClosedDay(d.date));
    const exceptions = CLINIC_CLOSED_HOLIDAYS.filter(h => h.date.startsWith(String(year))).flatMap(h => h.makeupWednesdays);
    assert.equal(regular.length, 24 - exceptions.length);
    for (const day of regular) {
      const spec = specs.find(s => s.validFrom === day.date);
      assert.equal(spec.opens, '00:00'); assert.equal(spec.closes, '00:00');
    }
  }
  assert.equal(specs.filter(s => s.validFrom === '2027-10-13').length, 1);
  assert.deepEqual(upcomingClinicClosedDates(new Date('2026-11-08T00:00:00+09:00')).slice(0, 2), ['2026-11-11', '2026-11-25']);
  assert.equal(upcomingClinicClosedDates(new Date('2026-11-11T15:00:00Z'))[0], '2026-11-25');
});

test('설날 당일 휴진, 연휴 공휴일 진료, 평일 시간으로 여는 수요일을 구분한다', () => {
  const at = (day, time) => computeStatus(new Date(`2027-02-${day}T${time}:00+09:00`));
  assert.match(at('07', '11:00').label, /설날 휴진/);
  for (const day of ['06', '08', '09']) {
    assert.deepEqual(at(day, '13:30'), { open: true, label: '진료중 16:00까지' });
    assert.equal(at(day, '16:00').open, false);
  }
  assert.match(at('09', '17:00').label, /내일 10:00/);
  assert.deepEqual(at('10', '10:00'), { open: true, label: '진료중 20:00까지' });
  assert.match(at('10', '13:30').label, /점심시간/);
  assert.equal(at('10', '19:59').open, true);
  assert.equal(at('10', '20:00').open, false);
  assert.match(at('24', '11:00').label, /정기 휴진/);
  const closures = upcomingClinicClosedDates(new Date('2027-02-01T00:00:00+09:00'));
  assert.ok(closures.includes('2027-02-07') && closures.includes('2027-02-24'));
  assert.ok(!closures.includes('2027-02-10'));
  const specs = clinicNode().openingHoursSpecification;
  assert.ok(!specs.some(s => s.validFrom === '2027-02-10'));
  assert.deepEqual(specs.filter(s => s.dayOfWeek?.includes('Wednesday')).map(s => [s.opens, s.closes]), [['10:00','13:00'],['14:00','20:00']]);
  assert.equal(upcomingClinicHolidaySchedules(new Date('2027-02-09T15:00:00Z'))[0].date, '2027-02-07');
  assert.equal(upcomingClinicHolidaySchedules(new Date('2027-02-10T15:00:00Z'))[0].date, '2027-09-15');
});

test('명절별 진료 수요일은 해당 명절에서 가장 가까운 둘째 또는 넷째 수요일이다', () => {
  for (const holiday of CLINIC_CLOSED_HOLIDAYS) {
    const base = Date.parse(holiday.date);
    const candidates = [];
    for (let delta = -21; delta <= 21; delta++) {
      const day = new Date(base + delta * 86_400_000);
      if (day.getUTCDay() === 3 && [2,4].includes(Math.ceil(day.getUTCDate()/7))) {
        candidates.push({ date: day.toISOString().slice(0, 10), distance: Math.abs(delta) });
      }
    }
    const closest = Math.min(...candidates.map(day => day.distance));
    for (const date of holiday.makeupWednesdays) {
      assert.ok(candidates.some(day => day.date === date && day.distance === closest), date);
    }
  }
});

test('명절 진료일을 고르기 전에는 후보 수요일을 휴진일이나 확정 진료일로 안내하지 않는다', () => {
  for (const holiday of CLINIC_CLOSED_HOLIDAYS.filter(h => h.makeupWednesdays.length > 1)) {
    assert.equal(isClinicClosedDay(holiday.date), true);
    const notice = clinicNode().additionalProperty.find(entry => entry.value.includes(holiday.date));
    assert.ok(notice.value.includes(holiday.makeupWednesdays.join(' 또는 ')) && notice.value.includes('확정 후 공지'));
    for (const date of holiday.makeupWednesdays) {
      assert.equal(CLINIC_DATED_HOURS.some(h => h.date === date), false);
      assert.match(computeStatus(new Date(`${date}T11:00:00+09:00`)).label, /진료 일정 문의/);
      assert.equal(upcomingClinicClosedDates(new Date(`${date}T11:00:00+09:00`)).includes(date), false);
    }
  }
});
