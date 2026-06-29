export type PostCategory = 'khẩn' | 'insight' | 'summary' | 'morning'

export interface CategoryConfig {
  id: PostCategory
  label: string
  bgClass: string
  textClass: string
  iconColor: string
}

export const CATEGORIES: Record<PostCategory, CategoryConfig> = {
  khẩn: {
    id: 'khẩn',
    label: 'Tin tức khẩn',
    bgClass: 'bg-[#5C120C]',
    textClass: 'text-[#F5827A]',
    iconColor: '#F5827A',
  },
  insight: {
    id: 'insight',
    label: 'On-chain Insight',
    bgClass: 'bg-[#002D67]',
    textClass: 'text-[#549BF8]',
    iconColor: '#54C2FF',
  },
  summary: {
    id: 'summary',
    label: 'Tổng kết cuối ngày',
    bgClass: 'bg-[#06301C]',
    textClass: 'text-[#60CF9B]',
    iconColor: '#60CF9B',
  },
  morning: {
    id: 'morning',
    label: 'Bản tin thị trường sáng',
    bgClass: 'bg-[#F0F9FF]',
    textClass: 'text-[#0074B5]',
    iconColor: '#0074B5',
  },
}

export interface ReviewPost {
  id: string
  category: PostCategory
  time: string
  title: string
  mainContent: string
  historyComparison: string
  kolInsight: string
  investorInsight: string
  sources: string
  authorTask: string
  traderInsight: string
  kolToolPosted: string
  status: 'pending' | 'processed'
  subStatus: 'waiting' | 't2_required' | 'published' | 'scheduled'
  scheduledTime?: string
  author?: string
}

export const MOCK_POSTS: ReviewPost[] = [
  {
    id: '1',
    category: 'khẩn',
    time: '19:00',
    title: 'TIN NÓNG — 21:12 04/06/2026 | Strategy bán BTC lần đầu sau ~4 năm + ETF rút ròng kỷ lục: thị trường bốc hơi ~140 tỷ$, BTC thủng $61k',
    mainContent: `SỰ KIỆN: Thị trường crypto trải qua đợt bán tháo mạnh nhất nhiều tháng, vốn hoá bốc hơi ~140 tỷ$ trong 24h. BTC thủng $61,360 trong đêm (mức thấp tương đương giai đoạn pre-war), hiện hồi về ~$64,450 (-3.5% / 24h). ETH chạm đáy $1,717, hiện ~$1,792 (-3.8%). Hai chất xúc tác chính: (1) Strategy (MicroStrategy) của Michael Saylor BÁN BTC LẦN ĐẦU sau gần 4 năm — phá vỡ narrative 'tay to không bao giờ bán'; (2) ETF spot BTC tại Mỹ rút ròng KỶ LỤC ~3.4–3.45 tỷ$ trong tuần, chuỗi 11 phiên rút liên tiếp, dẫn đầu là BlackRock & Fidelity — mức rút lớn nhất kể từ khi ra mắt 2024. Macro cộng hưởng: Fed bỏ ngôn ngữ 'tiến triển về mục tiêu 2%', kỳ vọng cắt lãi suất bị đẩy sang 2027; lợi suất TPCP Mỹ 10 năm +18bps lên 4.82%; căng thẳng Mỹ–Iran đẩy giá dầu/lạm phát; dòng tiền xoay sang AI/IPO. Khoảng ~3 tỷ$ vị thế đòn bẩy bị thanh lý trong 2 ngày (~1.7 tỷ$ trong 24h).

PHẢN ỨNG GIÁ (intraday/1h): BTC bật từ đáy $61.3k lên ~$64.4k (~+5% từ đáy) — bounce kỹ thuật từ vùng quá bán, CHƯA xác nhận đảo chiều. ETH hồi từ $1,717 → $1,792.

CHUỖI SỰ KIỆN: Nối tiếp đà giảm 2–3/6 (BTC từ ~$66k). So với đỉnh gần nhất $74,500 cuối tháng 5, BTC đã giảm >13%. Đây là leg giảm sâu thứ hai trong chuỗi risk-off do rút ETF kéo dài + lo ngại lãi suất.`,
    historyComparison: `1) ĐỨC BÁN BTC TỊCH THU (6–7/2024, ~50k BTC): BTC giảm từ ~$66k về ~$54k; sau khi bán hết, phục hồi hình V về $60k+ trong vài tuần. Áp lực bán từ holder lớn thường tạo đáy cục bộ rồi bật.
2) YEN CARRY UNWIND (5/8/2024): BTC sập ~$58k→$49k (~-16% trong ngày), >1 tỷ$ thanh lý; phục hồi hình V, lấy lại trên $60k trong ~3 tuần — thị trường over-react vài ngày.
3) ĐIỀU CHỈNH KÈM RÚT ETF Q1/2025 (lo ngại thuế quan): BTC từ >$100k về ~$78–80k, ETF rút mạnh; phục hồi CHẬM hơn (hình U/L) kéo dài nhiều tháng vì dòng rút dai dẳng + macro xấu.

PATTERN: Bán tháo do deleveraging/holder lớn + macro thường over-react 2–5 ngày rồi V-bounce; nhưng khi đi kèm dòng rút ETF dai dẳng và lãi suất tăng, phục hồi có xu hướng chậm (U/L). Lần này HỘI TỤ cả hai yếu tố → thận trọng với bounce sớm.`,
    kolInsight: `1) VÌ SAO QUAN TRỌNG CHO RETAIL VIỆT: Lần đầu Saylor/Strategy bán BTC — phá narrative 'tay to không bao giờ bán', dễ kích hoạt panic dây chuyền. KOL nên giải thích đây có thể là quản trị treasury/thanh khoản, không nhất thiết là tín hiệu bear dài hạn.
2) PATTERN OVER-REACT: Nhắc lại các đợt bán của holder lớn (Đức 2024, Mt.Gox) thường tạo đáy cục bộ và bật lại — tránh khuếch đại hoảng loạn, nhấn mạnh dữ liệu lịch sử.
3) PHÂN BIỆT NGUYÊN NHÂN: Đây chủ yếu là risk-off VĨ MÔ (Fed/lãi suất/dầu) + rotation sang AI, KHÔNG phải lỗi nội tại crypto (không có hack/sập sàn). Giúp cộng đồng giữ bình tĩnh và nhìn đúng bản chất.`,
    investorInsight: `1) VÙNG THEO DÕI — BTC: hỗ trợ $61k (đáy hôm nay) và vùng $58–60k (vùng gom Q1/2025); kháng cự $66–67k. ETH: hỗ trợ $1,700, kháng cự $1,860.
2) CẨN TRỌNG FOMO BẮT ĐÁY SỚM: Khi ETF còn rút ròng và lợi suất TPCP tăng, bounce có thể là 'dead-cat'. Tín hiệu xác nhận đáng tin hơn là dòng ETF đảo chiều sang mua ròng.
3) Quản trị rủi ro đòn bẩy trong môi trường thanh lý cao (~3 tỷ$/2 ngày). LƯU Ý: đây là thông tin tham khảo, KHÔNG phải khuyến nghị mua/bán.`,
    sources: `- CoinDesk (4/6, worst two-day liquidation): https://www.coindesk.com/markets/2026/06/04/bitcoin-steadies-above-usd60-000-while-derivatives-send-an-unambiguous-warning
- CoinDesk (2/6, ETF selloff $3.4B): https://www.coindesk.com/markets/2026/06/02/bitcoin-s-biggest-etf-selloff-yet-hits-usd3-4-billion-as-ai-stocks-keep-climbing
- Coinfomania (ETF outflow kỷ lục): https://coinfomania.com/bitcoin-etf-outflows-june-2026-record-selloff/
- Bitcoin.com News (Strategy sale + ETF): https://news.bitcoin.com/bitcoin-falls-under-66000-etf-outflows-strategy-sale/
- Yahoo Finance (Crypto News Today June 4): https://finance.yahoo.com/markets/crypto/articles/crypto-news-today-june-4-083742992.html
- Coinpedia (BTC below $61,500): https://coinpedia.org/news/crypto-crash-today-bitcoin-price-drops-below-61500-analysts-divided/`,
    authorTask: 'breaking-news-alert',
    traderInsight: '',
    kolToolPosted: '',
    status: 'pending',
    subStatus: 't2_required',
    author: 'Admin 01',
  },
  {
    id: '2',
    category: 'insight',
    time: '19:00',
    title: 'TIN NÓNG — 21:12 04/06/2026 | Strategy bán BTC lần đầu sau ~4 năm + ETF rút ròng kỷ lục: thị trường bốc hơi ~140 tỷ$, BTC thủng $61k',
    mainContent: 'Nội dung phân tích on-chain dữ liệu ví MicroStrategy di chuyển coin...',
    historyComparison: '',
    kolInsight: '',
    investorInsight: '',
    sources: '',
    authorTask: '',
    traderInsight: '',
    kolToolPosted: '',
    status: 'pending',
    subStatus: 'waiting',
  },
  {
    id: '3',
    category: 'summary',
    time: '19:00',
    title: 'TIN NÓNG — 21:12 04/06/2026 | Strategy bán BTC lần đầu sau ~4 năm + ETF rút ròng kỷ lục: thị trường bốc hơi ~140 tỷ$, BTC thủng $61k',
    mainContent: 'Tổng kết hoạt động thị trường crypto cuối ngày...',
    historyComparison: '',
    kolInsight: '',
    investorInsight: '',
    sources: '',
    authorTask: '',
    traderInsight: '',
    kolToolPosted: '',
    status: 'pending',
    subStatus: 'waiting',
  },
  {
    id: '4',
    category: 'morning',
    time: '07:00',
    title: 'TIN NÓNG — 21:12 04/06/2026 | Strategy bán BTC lần đầu sau ~4 năm + ETF rút ròng kỷ lục: thị trường bốc hơi ~140 tỷ$, BTC thủng $61k',
    mainContent: 'Bản tin nhận định thị trường crypto buổi sáng sớm...',
    historyComparison: '',
    kolInsight: '',
    investorInsight: '',
    sources: '',
    authorTask: '',
    traderInsight: '',
    kolToolPosted: '',
    status: 'pending',
    subStatus: 'waiting',
  },
  // Processed posts
  {
    id: '5',
    category: 'khẩn',
    time: '19:00',
    title: 'TIN NÓNG — 21:12 04/06/2026 | Strategy bán BTC lần đầu sau ~4 năm + ETF rút ròng kỷ lục: thị trường bốc hơi ~140 tỷ$, BTC thủng $61k',
    mainContent: 'Đã đăng thành công lên các kênh tier...',
    historyComparison: '',
    kolInsight: '',
    investorInsight: '',
    sources: '',
    authorTask: '',
    traderInsight: '',
    kolToolPosted: '',
    status: 'processed',
    subStatus: 'published',
    author: 'Admin 01',
  },
  {
    id: '6',
    category: 'insight',
    time: '19:00',
    title: 'TIN NÓNG — 21:12 04/06/2026 | Strategy bán BTC lần đầu sau ~4 năm + ETF rút ròng kỷ lục: thị trường bốc hơi ~140 tỷ$, BTC thủng $61k',
    mainContent: 'Đã lên lịch phát sóng vào lúc 10:00 ngày mai...',
    historyComparison: '',
    kolInsight: '',
    investorInsight: '',
    sources: '',
    authorTask: '',
    traderInsight: '',
    kolToolPosted: '',
    status: 'processed',
    subStatus: 'scheduled',
    scheduledTime: '10:00',
    author: 'Admin 01',
  },
]
