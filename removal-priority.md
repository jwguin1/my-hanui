# Search Console · 네이버 서치어드바이저 임시 삭제 요청 목록

> 생성: 2026-08-20 (Phase 1 배포 직후 · 커밋 `06361d7`)
> 대상: `status: "under_review"` 로 비공개 처리한 Line A 32편

> ## 🛑 2026-08-21 — 네이버 수집 제외는 **취소되었습니다**
>
> 네이버 서치어드바이저 데이터를 확인한 결과 **Line A 가 실유입의 대부분**이었다.
>
> | 채널 | 클릭 | 노출 |
> |---|---|---|
> | 네이버 | **1,300+** | **40,000+** |
> | 구글 (28일) | 20 | 173 |
>
> 60배 이상 차이다. 지금까지 구글 데이터만 보고 판단했고, 그 판단으로
> **실제 환자가 들어오는 문을 닫을 뻔했다.**
>
> 네이버 유입 상위에 Line A 가 있다:
>
> | URL | 클릭 | 노출 |
> |---|---|---|
> | `/skin/20260426-post-…` | 167 | 1,866 |
> | `/skin/20260422-post-…` | 100 | 1,999 |
> | `/pain/20260418-post-1` | 구글 최대 비브랜드 유입 | — |
>
> **네이버 서치어드바이저 「웹 페이지 수집 제외」를 실행하지 마십시오.**
> 이미 요청했다면 해제하십시오.
>
> 구글 Search Console 임시 삭제도 **1순위 4건 이외로 확대하지 않는다.**
> 아래 표는 구글 기준으로 만든 것이고, 네이버 유입이 있는 글은 다시 판단해야 한다.

---
## 왜 필요한가

noindex 는 **크롤러가 그 URL 을 다시 방문해야** 읽힌다. 32편이 실제로 색인에서
빠지는 데 몇 주가 걸릴 수 있고, 그동안 검색 결과에는 계속 노출된다.

임시 삭제(Removals)는 **약 6개월짜리 응급 조치**이고 반영은 보통 하루 안이다.
근본 해결은 noindex 쪽이고, 이건 그 사이의 공백을 막는 용도다.

## 점수 기준

의료법 제56조가 금지하는 **치료경험담** 구조의 강도로 매겼다.

| 가중치 | 패턴 |
|---|---|
| 5 | 「앞서 소개한 환자분의 경우」 개별 환자 서사 · 「이 환자분은 어떻게 회복되셨을까?」 경과 소제목 |
| 3 | 「환자의 경우」 지목 · 「치료 N주차」 경과 · 「VAS 7에서 3」 호전 수치 · 「현재는 월 1회」 |
| 2 | 일상복귀 단정 · 「호전되었습니다」 · 만족도 서술 |

---

## 1순위 — 즉시 (4건)

개별 환자의 경과가 **서사 형태로 통째로** 들어간 글이다. 가장 먼저 넣을 것.

```
https://www.ilsanhan.com/pain/20260429-post-1
https://www.ilsanhan.com/pain/20260426-post-1
https://www.ilsanhan.com/pain/20260429-post-2
https://www.ilsanhan.com/pain/20260426-post-4
```

| URL | 점수 | 해당 요소 |
|---|---|---|
| `/pain/20260429-post-1` 삼차신경통 | **23** | 개별 환자 서사 · 경과 소제목 · 주차별 경과 · 현재 상태 · 일상복귀 단정 · 호전 단정 |
| `/pain/20260426-post-1` 후두신경통 | **18** | 개별 환자 서사 · 「이 환자분은 어떻게 회복되셨을까?」 · VAS 8→5 |
| `/pain/20260429-post-2` 삼차신경통 | **16** | 개별 환자 서사 · 주차별 경과 · 호전 수치 |
| `/pain/20260426-post-4` 안면신경 | **13** | 개별 환자 서사 · 3주차/6주/12주 경과 |

## 2순위 — 1순위 반영 확인 후 (10건)

```
https://www.ilsanhan.com/pain/20260425-post-1
https://www.ilsanhan.com/pain/20260426-post-3
https://www.ilsanhan.com/pain/20260501-post-2
https://www.ilsanhan.com/pain/20260520-post-1
https://www.ilsanhan.com/skin/20260426-post-5
https://www.ilsanhan.com/skin/20260426-post-6
https://www.ilsanhan.com/diet/20260511-post-2
https://www.ilsanhan.com/pain/20260424-post-2
https://www.ilsanhan.com/pain/20260501-post-1
https://www.ilsanhan.com/pain/20260531-post-1
```

`/pain/20260424-post-2` 는 「현재는 월 1회 관리 치료를 받으면서 요가 활동도
재개한 상태입니다(VAS 7→2)」로, 점수는 8이지만 **현재 상태 보고가 가장 노골적**이다.

## 3순위 — 여력 있으면 (7건)

```
https://www.ilsanhan.com/pain/20260510-post-1
https://www.ilsanhan.com/pain/20260422-post-4
https://www.ilsanhan.com/pain/20260612-post-1
https://www.ilsanhan.com/diet/20260511-post-1
https://www.ilsanhan.com/pain/20260419-post-1
https://www.ilsanhan.com/pain/20260419-post-2
https://www.ilsanhan.com/pain/20260424-post-1
```

## 보류 — noindex 만으로 충분 (11건)

치료경험담 요소가 없거나 약하다. 임시 삭제까지 쓸 필요는 없다.
(`20260418-post-1/3`, `20260422-post-2`, `20260516-post-1/2`, `20260726-post-1`,
`20260728-post-1`, `20260418-post-2`, `20260726-post-2`, `20260420-post-2`, `20260422-post-5`)

---

## 절차

**Google Search Console** — 색인 생성 › 삭제 › 새 요청 › **일시적으로 URL 삭제**
- URL 하나씩. 「이 URL만 삭제」 선택 (접두사 삭제 아님 — Line B 가 같은 `/pain/` 아래 있다)
- 약 6개월 후 만료. 그전에 noindex 가 반영되면 영구 제외로 전환된다

~~**네이버 서치어드바이저** — 요청 › 웹 페이지 수집 제외~~
**2026-08-21 취소.** 네이버가 실유입의 대부분이고 Line A 가 그 상위에 있다.
수집 제외를 실행하지 말 것. 상단 배너 참조.

## 하지 말 것

- **접두사(prefix) 삭제 금지** — `/pain/` 을 통째로 넣으면 Line B 21편이 함께 사라진다
- **`robots.txt` 로 막지 말 것** — 크롤러가 못 들어가면 noindex 를 **영원히 못 읽는다.**
  임시 삭제가 만료되는 6개월 뒤 그대로 되살아난다

## 반영 확인

```bash
# 색인 상태 (Search Console URL 검사에 직접 넣어 확인)
curl -sI https://www.ilsanhan.com/pain/20260429-post-1 | grep -i x-robots-tag
curl -s  https://www.ilsanhan.com/pain/20260429-post-1 | grep -o '<meta name="robots"[^>]*>'
# → <meta name="robots" content="noindex, nofollow"/>  (2026-08-20 배포 확인 완료)
```
