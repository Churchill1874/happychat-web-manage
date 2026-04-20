import React, { useState, useEffect } from 'react'
import { Button, Tooltip } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { registerReport, commentReport, viewReport, rankReport } from '@/services/analysis'
import './index.less'

// ======================== 类型定义 ========================

export interface RankInfoResp {
    name: string
    avatarPath: string
    playerId: number
    address: string
    createTime: string
    commentCount: number
}

export interface RankReportResp {
    registerList: RankInfoResp[]
    loginList: RankInfoResp[]
    commentList: RankInfoResp[]
}

export interface ViewInfoResp {
    todayView: number
    yesterdayView: number
    dayViewRate: string
    thisWeekView: number
    lastWeekView: number
    weekViewRate: string
    thisMonthView: number
    lastMonthView: number
    monthViewRate: string
}

export interface ViewReportResp {
    southeastView: ViewInfoResp
    newsView: ViewInfoResp
    politicsView: ViewInfoResp
    societyView: ViewInfoResp
    topicViews: ViewInfoResp
}

export interface CommentReportResp {
    todayComment: number
    yesterdayComment: number
    dayCommentRate: string
    thisWeekComment: number
    lastWeekComment: number
    weekCommentRate: string
    thisMonthComment: number
    lastMonthComment: number
    monthCommentRate: string
    totalComment: number
}

export interface RegisterReportResp {
    todayRegister: number
    yesterdayRegister: number
    dayRegisterRate: string
    thisWeekRegister: number
    lastWeekRegister: number
    weekRegisterRate: string
    thisMonthRegister: number
    lastMonthRegister: number
    monthRegisterRate: string
    totalRegister: number
}

// ======================== 工具函数 ========================

/** 根据 rate 字符串判断涨跌方向，返回对应 className */
const rateToCls = (rate: string): string => {
    if (!rate || rate === '--' || rate === '0.00%') return 'p-neu'
    return rate.startsWith('↑') ? 'p-up' : 'p-dn'
}

/** 根据 rate 字符串判断浏览统计 badge className */
const rateToBadgeCls = (rate: string): string => {
    if (!rate || rate === '--' || rate === '0.00%') return ''
    return rate.startsWith('↑') ? 'up' : 'dn'
}

/** 格式化时间：LocalDateTime 字符串 → HH:mm:ss */
const formatTime = (dt: string): string => {
    if (!dt) return '--'
    // "2026-03-27T14:28:03" → "14:28:03"
    return dt.split('T')[1]?.slice(0, 8) ?? dt
}

/** 根据名字生成头像背景色和字色（固定色板，按首字charCode取余） */
const AVATAR_COLORS = [
    { bg: '#eff4ff', color: '#2563eb' },
    { bg: '#ecfdf5', color: '#10b981' },
    { bg: '#fff7ed', color: '#f97316' },
    { bg: '#f5f3ff', color: '#7c3aed' },
    { bg: '#fdf2f8', color: '#db2777' },
    { bg: '#fffbeb', color: '#f59e0b' },
    { bg: '#ecfeff', color: '#0891b2' },
    { bg: '#fff1f1', color: '#ef4444' },
]
const avatarStyle = (name: string) => {
    const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length
    return AVATAR_COLORS[idx]
}

// ======================== 新闻浏览统计配置 ========================

interface NewsConfig {
    key: keyof ViewReportResp
    label: string
    icon: string
    barColor: string
    barWidth: string
}

const NEWS_CONFIG: NewsConfig[] = [
    { key: 'southeastView', label: '东南亚新闻', icon: '🌏', barColor: 'var(--cyan)', barWidth: '78%' },
    { key: 'newsView', label: '国内新闻', icon: '🏮', barColor: 'var(--yellow)', barWidth: '88%' },
    { key: 'politicsView', label: '政治新闻', icon: '🏛️', barColor: 'var(--red)', barWidth: '55%' },
    { key: 'societyView', label: '社会新闻', icon: '🏙️', barColor: 'var(--green)', barWidth: '70%' },
    { key: 'topicViews', label: '话题新闻', icon: '🔥', barColor: 'var(--orange)', barWidth: '95%' },
]

// ======================== 评论统计配置 ========================

interface CommentConfig {
    label: string
    value: (d: CommentReportResp) => number
    rate: (d: CommentReportResp) => string
    rateLabel: (d: CommentReportResp | null) => string   // 改为函数
    color: string
    barColor: string
    barWidth: (d: CommentReportResp) => string
}

// barWidth 这里用固定值，实际可按 value/totalComment 动态算百分比

const COMMENT_CONFIG: CommentConfig[] = [
    {
        label: '今日评论', color: 'var(--accent)', barColor: 'var(--accent)', barWidth: () => '72%',
        value: d => d.todayComment, rate: d => d.dayCommentRate,
        rateLabel: d => `昨日 ${d?.yesterdayComment ?? '--'}`,
    },
    /*     {
            label: '昨日评论', color: 'var(--text2)', barColor: 'var(--border2)', barWidth: () => '61%',
            value: d => d.yesterdayComment, rate: () => '',
            rateLabel: () => '昨日数据',
        }, */
    {
        label: '本周评论', color: 'var(--cyan)', barColor: 'var(--cyan)', barWidth: () => '65%',
        value: d => d.thisWeekComment, rate: d => d.weekCommentRate,
        rateLabel: d => `上周 ${d?.lastWeekComment ?? '--'}`,  // ← 加上 lastWeekComment
    },
    {
        label: '本月评论', color: 'var(--accent2)', barColor: 'var(--accent2)', barWidth: () => '53%',
        value: d => d.thisMonthComment, rate: d => d.monthCommentRate,
        rateLabel: d => `上月 ${d?.lastMonthComment ?? '--'}`,
    },
    {
        label: '累计评论', color: 'var(--yellow)', barColor: 'var(--yellow)', barWidth: () => '90%',
        value: d => d.totalComment, rate: () => '',
        rateLabel: () => '历史总计',
    },
]
// ======================== 主组件 ========================

const Analysis: React.FC = () => {
    const [pressed, setPressed] = useState(false)


    const [loading, setLoading] = useState(false)
    const [regData, setRegData] = useState<RegisterReportResp | null>(null)
    const [commentData, setCommentData] = useState<CommentReportResp | null>(null)
    const [viewData, setViewData] = useState<ViewReportResp | null>(null)
    const [rankData, setRankData] = useState<RankReportResp | null>(null)

    const fetchAll = async () => {
        setLoading(true)
        try {
            const [reg, comment, view, rank] = await Promise.all([
                registerReport(),
                commentReport(),
                viewReport(),
                rankReport(),
            ])
            setRegData(reg.data)
            setCommentData(comment.data)
            setViewData(view.data)
            setRankData(rank.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    return (
        <>
            {/* ── 页头栏：刷新按钮 ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Tooltip title={loading ? '数据更新中...' : '刷新所有数据'} placement="left">
                    <Button
                        size="small"
                        icon={<ReloadOutlined spin={loading} />}
                        onClick={fetchAll}
                        onMouseDown={() => setPressed(true)}
                        onMouseUp={() => setPressed(false)}
                        onMouseLeave={() => setPressed(false)}  // 鼠标移出时也要复位，防止卡住
                        disabled={loading}
                        style={{
                            transform: pressed ? 'scale(0.92)' : 'scale(1)',
                            boxShadow: pressed ? 'none' : undefined,
                            display: 'inline-flex', alignItems: 'center',
                            height: 30, padding: '0 12px', borderRadius: 8,
                            fontSize: 14, fontWeight: 500,
                            color: loading ? 'var(--muted)' : 'var(--accent)',
                            borderColor: loading ? 'var(--border)' : 'var(--accent)',
                            background: loading ? 'var(--surface2)' : 'var(--accent-light)',
                            transition: 'all .2s',
                        }}
                    >
                        {loading ? '更新中...' : '刷新'}
                    </Button>
                </Tooltip>
            </div>

            {/* ── 用户注册统计 ── */}
            <div className="st">用户注册统计</div>
            <div className="reg-card">
                <div className="reg-grid">
                    <div className="reg-item">
                        <div className="ri-lbl">今日注册</div>
                        <div className="ri-val" style={{ color: 'var(--accent)' }}>{regData?.todayRegister ?? '--'}</div>
                        <div className="ri-diff">
                            <span className={`pill ${rateToCls(regData?.dayRegisterRate ?? '')}`}>{regData?.dayRegisterRate ?? '--'}</span>
                            <span style={{ color: 'var(--muted)' }}>较昨日 {regData?.yesterdayRegister}</span>
                        </div>
                    </div>
                    <div className="reg-item">
                        <div className="ri-lbl">本周注册</div>
                        <div className="ri-val" style={{ color: 'var(--accent2)' }}>{regData?.thisWeekRegister ?? '--'}</div>
                        <div className="ri-diff">
                            <span className={`pill ${rateToCls(regData?.weekRegisterRate ?? '')}`}>{regData?.weekRegisterRate ?? '--'}</span>
                            <span style={{ color: 'var(--muted)' }}>较上周 {regData?.lastWeekRegister}</span>
                        </div>
                    </div>
                    <div className="reg-item">
                        <div className="ri-lbl">本月注册</div>
                        <div className="ri-val" style={{ color: 'var(--cyan)' }}>{regData?.thisMonthRegister ?? '--'}</div>
                        <div className="ri-diff">
                            <span className={`pill ${rateToCls(regData?.monthRegisterRate ?? '')}`}>{regData?.monthRegisterRate ?? '--'}</span>
                            <span style={{ color: 'var(--muted)' }}>较上月{regData?.lastMonthRegister}</span>
                        </div>
                    </div>
                    <div className="reg-item">
                        <div className="ri-lbl">累计注册</div>
                        <div className="ri-val" style={{ color: 'var(--text)' }}>{regData?.totalRegister ?? '--'}</div>
                        <div className="ri-diff">
                            <span className="pill p-neu">截至今日</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 评论 / 留言统计 ── */}
            <div className="st">评论 / 留言统计</div>
            <div className="g4">
                {COMMENT_CONFIG.map(cfg => {
                    const val = commentData ? cfg.value(commentData) : null
                    const rate = commentData ? cfg.rate(commentData) : ''
                    const isNeutral = !rate   // 昨日 / 累计 没有 rate
                    return (
                        <div className="card" key={cfg.label}>
                            <div className="card-bar" style={{ background: cfg.barColor }} />
                            <div className="cs-pad">
                                <div className="cs-lbl">{cfg.label}</div>
                                <div className="cs-val" style={{ color: cfg.color }}>{val ?? '--'}</div>
                                <div className="cs-diff">
                                    {!isNeutral && rate
                                        ? <><span className={`pill ${rateToCls(rate)}`}>{rate}</span>{cfg.rateLabel(commentData)}</>
                                        : <span className="pill p-neu">{cfg.rateLabel(commentData)}</span>
                                    }
                                </div>
                                <div className="mini-wrap">
                                    <div className="mini-fill" style={{ width: cfg.barWidth(commentData!), background: cfg.barColor }} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── 新闻浏览统计 ── */}
            <div className="st">新闻浏览统计（今日 / 本周 / 本月 · vs 同期对比）</div>
            <div className="g5" style={{ marginBottom: 28 }}>
                {NEWS_CONFIG.map(cfg => {
                    const d = viewData?.[cfg.key]
                    return (
                        <div className="nc" key={cfg.key}>
                            <div className="nc-head">
                                <div className="nc-name">{cfg.icon} {cfg.label}</div>
                            </div>
                            <div className="nc-body">
                                <div className="nc-row">
                                    <div className="nc-period">今日</div>
                                    <div className="nc-right">
                                        <div className="nc-cur">{d?.todayView ?? '--'}</div>
                                        <div className="nc-prev">昨 {d?.yesterdayView ?? '--'}</div>
                                        <div className={`nc-badge ${rateToBadgeCls(d?.dayViewRate ?? '')}`}>{d?.dayViewRate ?? '--'}</div>
                                    </div>
                                </div>
                                <div className="nc-row">
                                    <div className="nc-period">本周</div>
                                    <div className="nc-right">
                                        <div className="nc-cur">{d?.thisWeekView ?? '--'}</div>
                                        <div className="nc-prev">上周 {d?.lastWeekView ?? '--'}</div>
                                        <div className={`nc-badge ${rateToBadgeCls(d?.weekViewRate ?? '')}`}>{d?.weekViewRate ?? '--'}</div>
                                    </div>
                                </div>
                                <div className="nc-row">
                                    <div className="nc-period">本月</div>
                                    <div className="nc-right">
                                        <div className="nc-cur">{d?.thisMonthView ?? '--'}</div>
                                        <div className="nc-prev">上月 {d?.lastMonthView ?? '--'}</div>
                                        <div className={`nc-badge ${rateToBadgeCls(d?.monthViewRate ?? '')}`}>{d?.monthViewRate ?? '--'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="nc-foot">
                                <div className="nc-bwrap">
                                    <div className="nc-bfill" style={{ width: cfg.barWidth, background: cfg.barColor }} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── 用户排行榜 ── */}
            <div className="st">用户排行榜</div>
            <div className="g3">

                {/* 最新注册 */}
                <div className="tc">
                    <div className="tc-head">
                        <div className="tc-title">🆕 最新注册用户</div>
                        <span className="tc-badge">最近 10 条 ↓</span>
                    </div>
                    <table>
                        <thead>
                            <tr><th>用户信息</th><th>注册时间</th><th>地址</th></tr>
                        </thead>
                        <tbody>
                            {rankData?.registerList?.map(u => {
                                return (
                                    <tr key={u.playerId}>
                                        <td>
                                            <div className="uc">
                                                <img
                                                    src={`/avatars/${u.avatarPath}.jpg`}
                                                    style={{ width: 30, height: 30, borderRadius: '20%' }}
                                                />

                                                <div><div className="un">{u.name}</div><div className="ua">{u.address}</div></div>
                                            </div>
                                        </td>
                                        <td><div className="tt">{u.createTime}</div></td>
                                        <td><span className="ip-tag">{u.address}</span></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 最近登录 */}
                <div className="tc">
                    <div className="tc-head">
                        <div className="tc-title">🔐 最近登录用户</div>
                        <span className="tc-badge">最近 10 条 ↓</span>
                    </div>
                    <table>
                        <thead>
                            <tr><th>用户信息</th><th>登录时间</th></tr>
                        </thead>
                        <tbody>
                            {rankData?.loginList?.map(u => {
                                return (
                                    <tr key={u.playerId}>
                                        <td>
                                            <div className="uc">
                                                <img
                                                    src={`/avatars/${u.avatarPath}.jpg`}
                                                    style={{ width: 30, height: 30, borderRadius: '20%' }}
                                                />
                                                <div><div className="un">{u.name}</div><div className="ua">{u.address}</div></div>
                                            </div>
                                        </td>
                                        <td><div className="tt">{u.createTime}</div></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 发言排行 */}
                <div className="tc">
                    <div className="tc-head">
                        <div className="tc-title">🏆 发言数量排行</div>
                        <span className="tc-badge">TOP 10</span>
                    </div>
                    <table>
                        <thead>
                            <tr><th>#</th><th>用户信息</th><th>发言数</th></tr>
                        </thead>
                        <tbody>
                            {rankData?.commentList?.map((u, idx) => {
                                const rankCls = idx === 0 ? 'rn r1' : idx === 1 ? 'rn r2' : idx === 2 ? 'rn r3' : 'rn'
                                const RANK_NUMS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
                                // 进度条宽度：以第一名为基准 100%
                                const maxCount = rankData.commentList[0]?.commentCount ?? 1
                                const barWidth = `${Math.round((u.commentCount / maxCount) * 100)}%`
                                return (
                                    <tr key={u.playerId}>
                                        <td><span className={rankCls}>{RANK_NUMS[idx] ?? idx + 1}</span></td>
                                        <td>
                                            <div className="uc">
                                                <img
                                                    src={`/avatars/${u.avatarPath}.jpg`}
                                                    style={{ width: 30, height: 30, borderRadius: '20%' }}
                                                />                                                <div><div className="un">{u.name}</div><div className="ua">{u.address}</div></div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cc">
                                                <span className="cv">{u.commentCount?.toLocaleString()}</span>
                                                <div className="bt"><div className="bf" style={{ width: barWidth }} /></div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default Analysis