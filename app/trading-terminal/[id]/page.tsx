"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Long/Short Badge Component with arrow icons
const TradeBadge = ({ type }: { type: 'Long' | 'Short' | 'LONG' | 'SHORT' | 'long' | 'short' }) => {
  const isLong = type.toLowerCase() === 'long'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '6px',
      backgroundColor: isLong ? '#0d2818' : '#2d1f1f',
      color: isLong ? '#22c55e' : '#ef4444',
      fontSize: '12px',
      fontWeight: '500',
    }}>
      <span style={{ fontSize: '10px' }}>{isLong ? '↗' : '↘'}</span>
      {isLong ? 'Long' : 'Short'}
    </span>
  )
}

// Performance Metrics - Compact Horizontal Bar
const PerformanceMetrics = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '12px 20px',
    backgroundColor: '#0d1210',
    borderRadius: '8px',
    border: '1px solid #1a2420',
    flexWrap: 'wrap',
  }}>
    {/* Total PNL */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: '#6b7c74', textTransform: 'uppercase' }}>PNL</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>+$1,245.8</span>
    </div>
    
    <div style={{ width: '1px', height: '20px', backgroundColor: '#1a2420' }} />
    
    {/* Win Rate */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: '#6b7c74', textTransform: 'uppercase' }}>Win Rate</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8e8' }}>65%</span>
      <span style={{ fontSize: '11px', color: '#6b7c74' }}>(13W/7L)</span>
    </div>
    
    <div style={{ width: '1px', height: '20px', backgroundColor: '#1a2420' }} />
    
    {/* Avg Win / Loss */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: '#6b7c74', textTransform: 'uppercase' }}>Avg W/L</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>+$156</span>
      <span style={{ color: '#6b7c74' }}>/</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>-$65</span>
      <span style={{ fontSize: '10px', color: '#6b7c74', backgroundColor: '#1a1a2e', padding: '2px 6px', borderRadius: '3px' }}>2.4:1</span>
    </div>
    
    <div style={{ width: '1px', height: '20px', backgroundColor: '#1a2420' }} />
    
    {/* Total Trades */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: '#6b7c74', textTransform: 'uppercase' }}>Trades</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8e8' }}>47</span>
      <span style={{ fontSize: '11px', color: '#6b7c74' }}>(21 pos)</span>
    </div>
    
    <div style={{ width: '1px', height: '20px', backgroundColor: '#1a2420' }} />
    
    {/* Total Volume */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: '#6b7c74', textTransform: 'uppercase' }}>Volume</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8e8' }}>$68,420</span>
    </div>
    
    <div style={{ width: '1px', height: '20px', backgroundColor: '#1a2420' }} />
    
    {/* Net ROI */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: '#6b7c74', textTransform: 'uppercase' }}>ROI</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>+12.5%</span>
    </div>
  </div>
)

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; color: string }> = {
    strong: { bg: '#0d2818', color: '#22c55e' },
    passed: { bg: '#0d2818', color: '#22c55e' },
    approved: { bg: '#0d2818', color: '#22c55e' },
    filled: { bg: '#0d2818', color: '#22c55e' },
    triggered: { bg: '#0d2818', color: '#22c55e' },
    add: { bg: '#2d2810', color: '#f59e0b' },
    'weak signal': { bg: '#2d1f1f', color: '#ef4444' },
    skipped: { bg: '#1a1a1a', color: '#6b7c74' },
    'no order': { bg: '#1a1a1a', color: '#6b7c74' },
  }
  const style = styles[status.toLowerCase()] || styles.skipped
  
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '4px',
      backgroundColor: style.bg,
      color: style.color,
      fontSize: '11px',
      fontWeight: '500',
      textTransform: 'capitalize',
    }}>{status}</span>
  )
}

// Decision Card Component
const DecisionCard = ({ decision, isExpanded, onToggle, onAskAssistant }: {
  decision: any
  isExpanded: boolean
  onToggle: () => void
  onAskAssistant?: (context: string) => void
  }) => {
  const [activeTab, setActiveTab] = useState('pipeline')
  
  const typeColors: Record<string, string> = {
    'OPEN LONG': '#22c55e',
    'ADD': '#22c55e',
    'ADD LONG': '#22c55e',
    'REDUCE': '#f59e0b',
    'REDUCE LONG': '#f59e0b',
    'CLOSE LONG': '#f59e0b',
    'OPEN SHORT': '#ef4444',
    'CLOSE SHORT': '#22c55e',
    'HOLD': '#6b7c74',
  }

  const typeIcons: Record<string, string> = {
    'OPEN LONG': '↗',
    'ADD': '↗',
    'ADD LONG': '↗',
    'REDUCE': '↙',
    'REDUCE LONG': '↙',
    'CLOSE LONG': '↘',
    'OPEN SHORT': '↘',
    'CLOSE SHORT': '↗',
    'HOLD': '▪',
  }

  return (
    <div style={{
      backgroundColor: '#0d1210',
      borderRadius: '8px',
      border: `1px solid ${isExpanded ? '#22c55e33' : '#1a2420'}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          cursor: 'pointer',
          borderBottom: isExpanded ? '1px solid #1a2420' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: (typeColors[decision.type] || '#6b7c74') + '20',
            color: typeColors[decision.type] || '#6b7c74',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}>{typeIcons[decision.type] || '▪'}</span>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>
              {decision.type} {decision.detail}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7c74', marginTop: '2px' }}>
              {decision.time} · {decision.prompt} · Position #{decision.positionId}
            </div>
            {/* Show TP/SL/RR for OPEN decisions */}
            {decision.type.includes('OPEN') && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px' }}>
                <span style={{ color: '#22c55e' }}>TP: {decision.tp || '+3%'}</span>
                <span style={{ color: '#ef4444' }}>SL: {decision.sl || '-2%'}</span>
                <span style={{ color: '#6b7c74', backgroundColor: '#1a1a2e', padding: '1px 6px', borderRadius: '3px' }}>R:R {decision.rr || '1:1.5'}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {decision.pnl !== null && (
              <span style={{
                color: decision.pnl >= 0 ? '#22c55e' : '#ef4444',
                fontWeight: '600',
                fontSize: '14px',
              }}>
                {decision.pnl >= 0 ? '+' : ''}${decision.pnl.toFixed(2)}
              </span>
            )}

            <span style={{ color: '#6b7c74', fontSize: '18px' }}>
              {isExpanded ? '∧' : '∨'}
            </span>
          </div>
          {!isExpanded && (
            <span style={{ fontSize: '11px', color: '#6b7c74' }}>
              → see more details
            </span>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: '0' }}>
          {/* Decision Details Header */}
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid #1a2420',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ 
              fontSize: '12px', 
              color: '#6b7c74', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              fontWeight: '600',
            }}>Decision Details</span>
            <span style={{ fontSize: '11px', color: '#6b7c74' }}>
              Round #{1500 + decision.id}
            </span>
          </div>
          
          {/* Sub Tabs */}
          <div style={{
            display: 'flex',
            gap: '0',
            borderBottom: '1px solid #1a2420',
            padding: '0 20px',
          }}>
            {[
              { id: 'pipeline', label: 'Pipeline' },
              { id: 'orders', label: `Orders (${decision.orders?.length || 0})` },
              { id: 'prompt', label: 'Prompt Snapshot' },
              { id: 'logs', label: 'Logs' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id); }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #22c55e' : '2px solid transparent',
                  color: activeTab === tab.id ? '#e8e8e8' : '#6b7c74',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginBottom: '-1px',
                }}
              >{tab.label}</button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '20px' }}>
            {activeTab === 'pipeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Decision Status Header */}
                <div style={{
                  backgroundColor: '#141a17',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #1a2420',
                }}>
                  {/* Status Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#0d2818',
                        color: '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                      }}>✓</span>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#e8e8e8' }}>Decision Complete</div>
                        <div style={{ fontSize: '12px', color: '#6b7c74' }}>Decision completed successfully</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#6b7c74' }}>Round ID</div>
                      <div style={{ fontSize: '13px', color: '#e8e8e8', fontFamily: 'monospace' }}>1769568674000_hy626w</div>
                    </div>
                  </div>
                  

                </div>

                {/* Research Agents Section */}
                <div style={{
                  backgroundColor: '#141a17',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #1a2420',
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#e8e8e8' }}>
                      Research Agents ({decision.researchAgents?.length || 0})
                    </div>
                  </div>
                  
                  {/* Agents Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {decision.researchAgents && decision.researchAgents.map((agent: any, i: number) => (
                      <div key={i} style={{
                        padding: '16px',
                        backgroundColor: '#0d1210',
                        borderRadius: '8px',
                        border: '1px solid #1a2420',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                            <span style={{ fontWeight: '500', fontSize: '14px', color: '#e8e8e8' }}>{agent.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: agent.signal === 'BULLISH' ? '#0d2818' : agent.signal === 'BEARISH' ? '#2d1f1f' : '#1a1a1a',
                              color: agent.signal === 'BULLISH' ? '#22c55e' : agent.signal === 'BEARISH' ? '#ef4444' : '#6b7c74',
                              fontSize: '11px',
                            }}>{agent.signal}</span>
                            <span style={{ fontSize: '12px', color: '#6b7c74', fontFamily: 'monospace' }}>{'>'}_ {agent.confidence} <span>▼</span></span>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7c74', marginBottom: '10px', lineHeight: '1.4' }}>{agent.description}</div>
                        {/* Structured Fields */}
                        {agent.timeframe && (
                          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#1a2420', color: '#a0a0a0', fontSize: '10px' }}>{agent.timeframe}</span>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#1a2420', color: '#a0a0a0', fontSize: '10px' }}>{agent.signalType}</span>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#1a2420', color: '#a0a0a0', fontSize: '10px' }}>{agent.horizon}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#6b7c74' }}>
                            <span>Confidence: <span style={{ color: agent.confidence >= 70 ? '#22c55e' : agent.confidence >= 50 ? '#f59e0b' : '#ef4444', fontWeight: '500' }}>{agent.confidence}%</span></span>
                            <span style={{ color: '#2d3d36' }}>|</span>
                            <span>Accuracy: {agent.accuracy}%</span>
                          </div>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '4px',
                            backgroundColor: '#0d2818',
                            border: '1px solid #22c55e33',
                            color: '#22c55e',
                            fontSize: '11px',
                            fontWeight: '500',
                          }}>Completed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manager Decision Process */}
                {decision.managerProcess && (
                  <div style={{
                    backgroundColor: '#141a17',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #1a2420',
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#e8e8e8' }}>Manager Decision Process</div>
                    <div style={{ fontSize: '12px', color: '#6b7c74', marginBottom: '16px' }}>Based on Research Agent signals + current state</div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {decision.managerProcess.map((step: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#0d2818',
                            color: '#22c55e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            flexShrink: 0,
                          }}>{i + 1}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#e8e8e8' }}>
                                {step.name}
                                {step.role && <span style={{ color: '#6b7c74', fontWeight: '400' }}> ({step.role})</span>}
                              </span>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '600',
                                backgroundColor: step.status === 'APPROVED' ? '#0d2818' : 
                                               step.status === 'WARNING' ? '#2d2810' :
                                               step.status === 'EXECUTED' ? '#0d2818' :
                                               step.action?.includes('LONG') ? '#0d2818' : 
                                               step.action?.includes('CLOSE') ? '#2d2810' : 
                                               step.action?.includes('HOLD') ? '#1a1a1a' : '#0d2818',
                                color: step.status === 'APPROVED' ? '#22c55e' : 
                                      step.status === 'WARNING' ? '#f59e0b' :
                                      step.status === 'EXECUTED' ? '#22c55e' :
                                      step.action?.includes('CLOSE') ? '#f59e0b' : 
                                      step.action?.includes('HOLD') ? '#6b7c74' : '#22c55e',
                              }}>
                                {step.status === 'APPROVED' && '✓ APPROVED'}
                                {step.status === 'WARNING' && '⚠ WARNING'}
                                {step.status === 'EXECUTED' && '⚡ EXECUTED'}
                                {step.action && !step.status && (step.action.includes('OPEN') ? '↗ ' : step.action.includes('ADD') ? '+ ' : step.action.includes('CLOSE') ? '✕ ' : step.action.includes('REDUCE') ? '− ' : step.action.includes('HOLD') ? '▪ ' : '') + step.action}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7c74', lineHeight: '1.5' }}>{step.description}</div>
                            
                            {/* Risk Manager Checks */}
                            {step.checks && (
                              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                {step.checks.map((check: any, ci: number) => (
                                  <span key={ci} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '3px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: check.passed ? '#0d281833' : '#2d1f1f33',
                                    border: `1px solid ${check.passed ? '#22c55e22' : '#ef444422'}`,
                                    fontSize: '10px',
                                    color: check.passed ? '#22c55e' : '#ef4444',
                                  }}>
                                    {check.passed ? '\u2713' : '\u2717'} {check.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* PM Aggregation Logic */}
                            {step.aggregation && (
                              <div style={{
                                marginTop: '10px',
                                padding: '12px',
                                backgroundColor: '#0d1210',
                                borderRadius: '6px',
                                border: '1px solid #1a2420',
                                fontSize: '11px',
                              }}>
                                <div style={{ color: '#6b7c74', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px' }}>Aggregation Logic</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a0a0a0' }}>
                                    <span>Method: {step.aggregation.method}</span>
                                    <span>Threshold: {'>'} {step.aggregation.threshold}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '12px', color: '#a0a0a0' }}>
                                    {Object.entries(step.aggregation.weights).map(([name, w]: [string, any]) => (
                                      <span key={name}>
                                        {name}: <span style={{ color: '#e8e8e8', fontFamily: 'monospace' }}>{w}</span>
                                      </span>
                                    ))}
                                  </div>
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    marginTop: '4px',
                                    paddingTop: '6px',
                                    borderTop: '1px solid #1a2420',
                                  }}>
                                    <span style={{ color: '#6b7c74' }}>Score:</span>
                                    <span style={{ 
                                      color: step.aggregation.score >= step.aggregation.threshold ? '#22c55e' : '#f59e0b',
                                      fontWeight: '600',
                                      fontFamily: 'monospace',
                                    }}>{step.aggregation.score.toFixed(2)}</span>
                                    <span style={{ 
                                      padding: '2px 8px', 
                                      borderRadius: '4px',
                                      backgroundColor: step.aggregation.score >= step.aggregation.threshold ? '#0d2818' : '#2d2810',
                                      color: step.aggregation.score >= step.aggregation.threshold ? '#22c55e' : '#f59e0b',
                                      fontSize: '10px',
                                      fontWeight: '600',
                                    }}>{step.aggregation.score >= step.aggregation.threshold ? 'ABOVE THRESHOLD' : 'BELOW THRESHOLD'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Trader Execution Quality */}
                            {step.execution && (
                              <div style={{
                                marginTop: '10px',
                                padding: '12px',
                                backgroundColor: '#0d1210',
                                borderRadius: '6px',
                                border: '1px solid #1a2420',
                                fontSize: '11px',
                              }}>
                                <div style={{ color: '#6b7c74', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px' }}>Execution Quality</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                  <div>
                                    <div style={{ color: '#6b7c74', marginBottom: '2px' }}>Order Type</div>
                                    <div style={{ color: '#e8e8e8', fontWeight: '500' }}>{step.execution.orderType}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#6b7c74', marginBottom: '2px' }}>Slippage</div>
                                    <div style={{ 
                                      color: step.execution.slippage.startsWith('-') ? '#22c55e' : step.execution.slippage.startsWith('+') ? '#ef4444' : '#e8e8e8', 
                                      fontWeight: '500', 
                                      fontFamily: 'monospace' 
                                    }}>{step.execution.slippage}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#6b7c74', marginBottom: '2px' }}>Fill vs Decision</div>
                                    <div style={{ color: '#e8e8e8', fontFamily: 'monospace' }}>
                                      ${step.execution.fillPrice.toLocaleString()} vs ${step.execution.decisionPrice.toLocaleString()}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ color: '#6b7c74', marginBottom: '2px' }}>Latency</div>
                                    <div style={{ color: '#e8e8e8', fontWeight: '500', fontFamily: 'monospace' }}>{step.execution.latency}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision Results Section - Token Based */}
                <div style={{
                  backgroundColor: '#141a17',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #1a2420',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>💡</span>
                      <span style={{ fontWeight: '600', fontSize: '14px', color: '#e8e8e8' }}>Decision Results</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7c74' }}>
                      4 analysis · {decision.orders?.length || 1} orders
                    </span>
                  </div>
                  
                  {/* Analysis Results */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px' }}>🔍</span>
                      <span style={{ fontSize: '13px', color: '#6b7c74' }}>Analysis Results</span>
                    </div>
                    
                    {/* Token Analysis Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { token: 'BTC', signal: 'NEUTRAL', confidence: 65 },
                        { token: 'ETH', signal: 'NEUTRAL', confidence: 60 },
                        { token: 'BTC/USDT', signal: 'BULLISH', confidence: 68 },
                      ].map((item, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          backgroundColor: '#0d1210',
                          borderRadius: '6px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: '600', fontSize: '14px', color: '#e8e8e8' }}>{item.token}</span>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: item.signal === 'BULLISH' ? '#0d2818' : item.signal === 'BEARISH' ? '#2d1f1f' : '#1a1a1a',
                              color: item.signal === 'BULLISH' ? '#22c55e' : item.signal === 'BEARISH' ? '#ef4444' : '#6b7c74',
                              fontSize: '11px',
                            }}>
                              {item.signal === 'BULLISH' ? 'Bullish' : item.signal === 'BEARISH' ? 'Bearish' : 'Neutral'} 1
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#6b7c74', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Avg Confidence {item.confidence}% <span>▼</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legacy Pipeline Steps (fallback) */}
                {!decision.researchAgents && decision.pipeline.map((step: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    backgroundColor: '#141a17',
                    borderRadius: '6px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: step.status !== 'Skipped' && step.status !== 'No Order' ? '#0d2818' : '#1a1a1a',
                        color: step.status !== 'Skipped' && step.status !== 'No Order' ? '#22c55e' : '#6b7c74',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                      }}>
                        {step.status !== 'Skipped' && step.status !== 'No Order' ? '✓' : '−'}
                      </span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{step.name}</div>
                        {step.detail && (
                          <div style={{ fontSize: '12px', color: '#6b7c74', marginTop: '2px' }}>{step.detail}</div>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={step.status} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {decision.orders?.length > 0 ? decision.orders.map((order: any, i: number) => (
                  <div key={i} style={{
                    padding: '14px 16px',
                    backgroundColor: '#141a17',
                    borderRadius: '6px',
                    fontSize: '13px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500' }}>{order.type}</span>
                      <span style={{ color: '#6b7c74' }}>{order.time}</span>
                    </div>
                    <div style={{ color: '#6b7c74' }}>
                      {order.size} @ ${order.price}
                    </div>
                  </div>
                )) : (
                  <div style={{ color: '#6b7c74', fontSize: '13px', padding: '20px', textAlign: 'center' }}>
                    No orders for this decision
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prompt' && (
              <div style={{
                padding: '16px',
                backgroundColor: '#141a17',
                borderRadius: '6px',
                border: '1px solid #22c55e33',
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  backgroundColor: '#0d2818',
                  color: '#22c55e',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '12px',
                }}>
                  {decision.prompt} <span style={{ color: '#6b7c74', fontWeight: '400' }}>(immutable snapshot)</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#c8c8c8' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#e8e8e8' }}>Entry:</strong>
                    <div style={{ color: '#6b7c74', marginLeft: '8px' }}>
                      · 1H breakout + 2 candle confirmation<br/>
                      · Volume {'>'} 1.5x average
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#e8e8e8' }}>Risk:</strong>
                    <div style={{ color: '#6b7c74', marginLeft: '8px' }}>
                      · Position: 5% per trade<br/>
                      · Stop loss: 2%<br/>
                      · Take profit: 2:1
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div>
                {/* Log Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    backgroundColor: '#141a17',
                    border: '1px solid #2d3d36',
                    color: '#e8e8e8',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    Copy Logs
                  </button>
                  <button style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    backgroundColor: '#141a17',
                    border: '1px solid #2d3d36',
                    color: '#e8e8e8',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    Download Logs
                  </button>
                </div>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#0a0f0d',
                  borderRadius: '6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                lineHeight: '1.8',
                color: '#6b7c74',
                maxHeight: '200px',
                overflow: 'auto',
              }}>
                <div><span style={{ color: '#22c55e' }}>[{decision.time}]</span> Decision cycle started</div>
                <div><span style={{ color: '#22c55e' }}>[{decision.time}]</span> Research agent analyzing market conditions...</div>
                <div><span style={{ color: '#22c55e' }}>[{decision.time}]</span> Signal strength: 0.87 (Strong)</div>
                <div><span style={{ color: '#22c55e' }}>[{decision.time}]</span> Risk pre-check passed</div>
                <div><span style={{ color: '#22c55e' }}>[{decision.time}]</span> PM proposal generated: {decision.type}</div>
                <div><span style={{ color: '#22c55e' }}>[{decision.time}]</span> Risk post-check approved</div>
                <div><span style={{ color: '#22c55e' }}>[{decision.time}]</span> Executing order...</div>
                  <div><span style={{ color: '#22c55e' }}>[{decision.time}]</span> Order filled successfully</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Combined Chart Component (PNL History + Price Chart)
const CombinedChart = ({ 
  activeChartTab, setActiveChartTab, 
  selectedToken, setSelectedToken, availableTokens,
  timeRange, setTimeRange, priceTimeframe, setPriceTimeframe,
  trades
}: {
  activeChartTab: string
  setActiveChartTab: (tab: string) => void
  selectedToken: string
  setSelectedToken: (token: string) => void
  availableTokens: string[]
  timeRange: string
  setTimeRange: (range: string) => void
  priceTimeframe: string
  setPriceTimeframe: (tf: string) => void
  trades: { x: number; y: number; type: string }[]
}) => (
  <div style={{ backgroundColor: '#0d1210', borderRadius: '12px', border: '1px solid #1a2420', padding: '20px' }}>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #1a2420' }}>
        {[{ id: 'pnl', label: 'PNL History' }, { id: 'price', label: 'Price Chart' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveChartTab(tab.id)} style={{
            padding: '8px 16px', backgroundColor: 'transparent', border: 'none',
            borderBottom: activeChartTab === tab.id ? '2px solid #22c55e' : '2px solid transparent',
            color: activeChartTab === tab.id ? '#e8e8e8' : '#6b7c74',
            cursor: 'pointer', fontSize: '15px', fontWeight: '500', marginBottom: '-1px',
          }}>{tab.label}</button>
        ))}
      </div>
      
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {activeChartTab === 'price' && (
          <div style={{ position: 'relative' }}>
            <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)} style={{
              padding: '6px 32px 6px 12px', borderRadius: '6px', backgroundColor: '#141a17',
              border: '1px solid #2d3d36', color: '#22c55e', fontSize: '12px', fontWeight: '600',
              cursor: 'pointer', appearance: 'none', outline: 'none',
            }}>
              {availableTokens.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7c74', fontSize: '10px', pointerEvents: 'none' }}>▼</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: '4px' }}>
          {activeChartTab === 'pnl'
            ? ['7D', '14D', 'All'].map(r => (
                <button key={r} onClick={() => setTimeRange(r)} style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: timeRange === r ? '#1a2420' : 'transparent', border: 'none', color: timeRange === r ? '#e8e8e8' : '#6b7c74', cursor: 'pointer', fontSize: '12px' }}>{r}</button>
              ))
            : ['15m', '1h', '4h', '1D'].map(tf => (
                <button key={tf} onClick={() => setPriceTimeframe(tf)} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: priceTimeframe === tf ? '#1a2420' : 'transparent', border: 'none', color: priceTimeframe === tf ? '#e8e8e8' : '#6b7c74', cursor: 'pointer', fontSize: '12px' }}>{tf}</button>
              ))
          }
        </div>
      </div>
    </div>
    
    {/* Chart Content */}
    <div style={{ position: 'relative', height: '280px' }}>
      {activeChartTab === 'pnl' ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 36, width: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '14px', color: '#6b7c74', fontFamily: 'monospace' }}>
            <span>+$1,500</span><span>+$750</span><span>$0</span><span>-$250</span>
          </div>
          <svg style={{ marginLeft: '80px', width: 'calc(100% - 80px)', height: '240px' }} viewBox="0 0 800 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lossGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" /><stop offset="100%" stopColor="#ef4444" stopOpacity="0" /></linearGradient>
              <linearGradient id="profitGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></linearGradient>
            </defs>
            <line x1="0" y1="0" x2="800" y2="0" stroke="#1a2420" strokeDasharray="4" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#1a2420" strokeDasharray="4" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#1a2420" strokeDasharray="4" />
            <line x1="0" y1="240" x2="800" y2="240" stroke="#1a2420" />
            <line x1="0" y1="168" x2="800" y2="168" stroke="#6b7c74" strokeDasharray="2" strokeOpacity="0.3" />
            <path d="M 0,185 L 80,190 L 160,182 L 240,198 L 320,175 L 400,140 L 480,100 L 560,80 L 640,65 L 720,52 L 780,42" fill="none" stroke="#22c55e" strokeWidth="2.5" />
            <path d="M 0,185 L 80,190 L 160,182 L 240,198 L 320,175 L 400,140 L 400,240 L 0,240 Z" fill="url(#lossGrad)" />
            <path d="M 400,140 L 480,100 L 560,80 L 640,65 L 720,52 L 780,42 L 780,240 L 400,240 Z" fill="url(#profitGrad)" />
            <circle cx="640" cy="65" r="7" fill="#22c55e" stroke="#0a0f0d" strokeWidth="2.5" />
          </svg>
          <div style={{ position: 'absolute', right: '40px', top: '20px', backgroundColor: '#1a2420', padding: '14px 18px', borderRadius: '8px', fontSize: '13px', border: '1px solid #2d3d36' }}>
            <div style={{ color: '#6b7c74', marginBottom: '6px', fontSize: '13px' }}>Jan 15</div>
            <div style={{ color: '#e8e8e8', marginBottom: '4px', fontSize: '14px' }}>Position #12 closed</div>
            <div style={{ color: '#22c55e', fontWeight: '600', fontSize: '16px' }}>+$892.50</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '80px', marginTop: '8px', fontSize: '13px', color: '#6b7c74' }}>
            <span>Jan 8</span><span>Jan 10</span><span>Jan 12</span><span>Jan 14</span><span>Jan 16</span><span>Jan 18</span><span>Jan 20</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', left: '80px', top: '0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px', fontWeight: '600' }}>$2.5480</span>
            <span style={{ color: '#22c55e', fontSize: '15px' }}>+2.25%</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 36, bottom: 36, width: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '14px', color: '#6b7c74', fontFamily: 'monospace' }}>
            <span>$2.70</span><span>$2.55</span><span>$2.40</span><span>$2.25</span>
          </div>
          <svg style={{ marginLeft: '80px', marginTop: '36px', width: 'calc(100% - 80px)', height: '200px' }} viewBox="0 0 800 200" preserveAspectRatio="none">
            <defs><linearGradient id="priceGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></linearGradient></defs>
            <line x1="0" y1="0" x2="800" y2="0" stroke="#1a2420" strokeDasharray="4" />
            <line x1="0" y1="67" x2="800" y2="67" stroke="#1a2420" strokeDasharray="4" />
            <line x1="0" y1="133" x2="800" y2="133" stroke="#1a2420" strokeDasharray="4" />
            <line x1="0" y1="200" x2="800" y2="200" stroke="#1a2420" />
            <path d="M 0,168 L 60,162 L 120,156 L 180,165 L 240,150 L 300,138 L 360,126 L 420,114 L 480,102 L 540,90 L 600,84 L 660,78 L 720,72 L 760,66 L 790,60" fill="none" stroke="#22c55e" strokeWidth="2.5" />
            <path d="M 0,168 L 60,162 L 120,156 L 180,165 L 240,150 L 300,138 L 360,126 L 420,114 L 480,102 L 540,90 L 600,84 L 660,78 L 720,72 L 760,66 L 790,60 L 790,200 L 0,200 Z" fill="url(#priceGrad)" />
            {trades.map((trade, i) => {
              const scaledX = (trade.x / 550) * 790
              const scaledY = (trade.y / 170) * 200
              return (
              <g key={i}>
                <line x1={scaledX} y1={scaledY} x2={scaledX} y2="200" stroke={trade.type === 'buy' ? '#22c55e' : '#ef4444'} strokeDasharray="4" strokeOpacity="0.5" />
                <circle cx={scaledX} cy={scaledY} r="10" fill={trade.type === 'buy' ? '#22c55e' : '#ef4444'} stroke="#0a0f0d" strokeWidth="2.5" style={{ cursor: 'pointer' }} />
                <text x={scaledX} y={scaledY + 5} textAnchor="middle" fontSize="12" fill="#0a0f0d" fontWeight="bold">{trade.type === 'buy' ? '\u2191' : '\u2193'}</text>
              </g>
              )
            })}
            <line x1="0" y1="174" x2="800" y2="174" stroke="#ef4444" strokeDasharray="6 3" strokeOpacity="0.6" />
            <line x1="0" y1="30" x2="800" y2="30" stroke="#22c55e" strokeDasharray="6 3" strokeOpacity="0.6" />
          </svg>
          <div style={{ position: 'absolute', right: '10px', top: '60px', fontSize: '13px', color: '#22c55e', backgroundColor: '#0d2818', padding: '4px 10px', borderRadius: '4px', fontFamily: 'monospace' }}>TP $2.62</div>
          <div style={{ position: 'absolute', right: '10px', bottom: '60px', fontSize: '13px', color: '#ef4444', backgroundColor: '#2d1f1f', padding: '4px 10px', borderRadius: '4px', fontFamily: 'monospace' }}>SL $2.44</div>
          <div style={{ position: 'absolute', left: '45%', top: '70px', backgroundColor: '#1a2420', padding: '14px 16px', borderRadius: '8px', fontSize: '13px', border: '1px solid #2d3d36', minWidth: '170px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ padding: '3px 8px', backgroundColor: '#0d2818', color: '#22c55e', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>OPEN LONG</span>
              <span style={{ color: '#6b7c74', fontSize: '13px' }}>#21</span>
            </div>
            <div style={{ color: '#e8e8e8', marginBottom: '4px', fontSize: '14px' }}>125.5 XRP @ $2.4920</div>
            <div style={{ color: '#6b7c74', marginBottom: '8px', fontSize: '13px' }}>Jan 20, 9:30 AM</div>
            <div style={{ color: '#22c55e', cursor: 'pointer', fontSize: '13px' }}>View decision {'\u2192'}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '80px', marginTop: '8px', fontSize: '13px', color: '#6b7c74' }}>
            <span>9:00</span><span>10:00</span><span>11:00</span><span>12:00</span><span>Now</span>
          </div>
          <div style={{ position: 'absolute', bottom: '40px', left: '90px', display: 'flex', gap: '20px', fontSize: '13px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} /><span style={{ color: '#6b7c74' }}>Buy / Add</span></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} /><span style={{ color: '#6b7c74' }}>Sell / Close</span></span>
          </div>
        </>
      )}
    </div>
  </div>
)

// Main Dashboard Component
export default function TradingAgentDashboard() {
  const [activeTab, setActiveTab] = useState('live')
  const [historySubTab, setHistorySubTab] = useState('positions')
  const [positionFilter, setPositionFilter] = useState('all')
  const [liveSubTab, setLiveSubTab] = useState<'positions' | 'orders' | 'run'>('positions')
  const [orderFilter, setOrderFilter] = useState('All')
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [expandedLivePos, setExpandedLivePos] = useState<string | null>(null)
  const [expandedLivePosDecision, setExpandedLivePosDecision] = useState<number | null>(null)

  
  // Multiple positions data - supports different coins and multiple entries per coin
  const positions = [
    { id: 1, coin: 'BTC', side: 'LONG', size: '0.15 BTC', entry: 94250.50, current: 95180.20, pnl: 139.45, pnlPercent: 0.99, sl: 92300, tp: 99000, holding: '4h 23m' },
    { id: 2, coin: 'BTC', side: 'SHORT', size: '0.08 BTC', entry: 95500.00, current: 95180.20, pnl: 25.58, pnlPercent: 0.33, sl: 96800, tp: 93000, holding: '1h 12m' },
    { id: 3, coin: 'ETH', side: 'LONG', size: '2.5 ETH', entry: 3420.80, current: 3485.60, pnl: 162.00, pnlPercent: 1.90, sl: 3350, tp: 3650, holding: '6h 45m' },
    { id: 4, coin: 'SOL', side: 'LONG', size: '50 SOL', entry: 185.20, current: 192.45, pnl: 362.50, pnlPercent: 3.91, sl: 178, tp: 210, holding: '2h 30m' },
    { id: 5, coin: 'ETH', side: 'SHORT', size: '1.2 ETH', entry: 3510.00, current: 3485.60, pnl: 29.28, pnlPercent: 0.70, sl: 3600, tp: 3350, holding: '45m' },
  ]
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [expandedDecision, setExpandedDecision] = useState<number | null>(null)
  const [showTrades, setShowTrades] = useState(false)
  const [expandedRun, setExpandedRun] = useState<string | null>(null)
  const [expandedRunDetail, setExpandedRunDetail] = useState<string | null>(null)
  const [decisionFilter, setDecisionFilter] = useState('All')
  const [tokenFilter, setTokenFilter] = useState('All')

  const [showConfigModal, setShowConfigModal] = useState(false)
  const [isRunning, setIsRunning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [showLiquidationModal, setShowLiquidationModal] = useState(false)
  const [liquidationMode, setLiquidationMode] = useState<'market' | 'limit'>('market')
  const [showLiquidateAllModal, setShowLiquidateAllModal] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m')
  
  const [activeChartTab, setActiveChartTab] = useState('price')
  const [selectedToken, setSelectedToken] = useState('XRPUSDT')
  const [chartTimeRange, setChartTimeRange] = useState('7D')
  const [priceTimeframe, setPriceTimeframe] = useState('15m')
  const availableTokens = ['XRPUSDT', 'BTCUSDT', 'ETHUSDT']
  const chartTrades = [
    { x: 200, y: 115, type: 'buy' },
    { x: 350, y: 75, type: 'buy' },
    { x: 480, y: 60, type: 'sell' },
  ]
  const [promptVersion, setPromptVersion] = useState('v3')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string }>>([])
  const [pendingPromptChanges, setPendingPromptChanges] = useState(false)
  const [isApplyingChanges, setIsApplyingChanges] = useState(false)

// Handler for Run Now
  const handleRunNow = () => {
    setIsRunning(true)
    setIsPaused(false)
    // Simulate a run
    alert('Agent run triggered! Analyzing market conditions...')
  }

  // Handler for Pause/Resume
  const handlePause = () => {
    setIsPaused(!isPaused)
    if (!isPaused) {
      alert('Agent paused. No new decisions will be made.')
    } else {
      alert('Agent resumed. Will continue making decisions.')
    }
  }

  // Handler for Force Close
  const handleForceClose = () => {
    if (confirm('Force close current position at market price?')) {
      alert('Position closed at market price.')
    }
  }

// Handler for Force Liquidation
  const [liquidatingPositionId, setLiquidatingPositionId] = useState<number | null>(null)
  const handleForceLiquidation = (positionId?: number) => {
  if (positionId) setLiquidatingPositionId(positionId)
  setShowLiquidationModal(true)
  }
  
  // Handler for confirming liquidation
  const handleConfirmLiquidation = () => {
    setShowLiquidationModal(false)
    alert(liquidationMode === 'market' ? 'Position closed at market price.' : 'Limit order placed for closing position.')
  }



  // Handler for Continue Editing
  const handleContinueEditing = () => {
    setChatInput('I want to make more adjustments to the entry rules...')
  }

  // Handler for Ask Assistant (context from left panel)
  const handleAskAssistant = (context: string) => {
    setChatMessages(prev => [...prev, { role: 'user', text: context }])
    // Simulate AI response based on context
    setTimeout(() => {
      let response = ''
      if (context.includes('decision')) {
        response = `Looking at this decision, I can see the agent analyzed multiple signals before executing. The Technical agent showed 78% confidence with bullish engulfing pattern detected. Would you like me to explain the risk management process or suggest optimizations?`
      } else if (context.includes('position')) {
        response = `This position was opened based on strong technical signals. Current P&L is positive with the stop loss moved to breakeven after the ADD decision. The position is well-managed within your risk parameters.`
      } else if (context.includes('run')) {
        response = `This run completed successfully. The agent processed market data, analyzed signals from all research agents, and made a decision based on your current prompt configuration. Would you like to see the detailed execution logs?`
      } else {
        response = `I understand you want to know more about "${context}". Let me analyze this for you and provide insights based on your trading history and current strategy settings.`
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: response }])
    }, 800)
  }

  const currentPrompt = {
    version: 'v3',
    style: 'Balanced',
  }

  const decisions = [
{
  id: 1,
  type: 'OPEN LONG',
  detail: '0.04 BTC @ $93,450',
  time: 'Today, 9:30 AM',
  prompt: 'Prompt v3',
  positionId: 21,
  pnl: 7.03,
  fee: -0.93,
  tp: '$96,250',
  sl: '$91,800',
  rr: '1:1.7',
  orders: [{ type: 'Market Buy', size: '0.04 BTC', price: '93,450', time: '9:30:15 AM' }],
  researchAgents: [
  { name: 'Technical', confidence: 78, accuracy: 73, signal: 'BULLISH', description: 'Bullish engulfing on 4h. Breakout starting.', timeframe: '4H', signalType: 'Trend', horizon: 'Mid' },
  { name: 'Whale', confidence: 85, accuracy: 68, signal: 'BULLISH', description: '+$4.2M overnight accumulation.', timeframe: '24H', signalType: 'Momentum', horizon: 'Short' },
  { name: 'Sentiment', confidence: 55, accuracy: 65, signal: 'NEUTRAL', description: 'Social feeds mixed. No strong conviction.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'No position. First trade of session. Checks passed.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'OPEN LONG', description: '3/4 agents BULLISH. Starting 0.04 BTC (8% capital).', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.74, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Position size within limits. Risk/reward acceptable.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Trader', status: 'EXECUTED', description: 'Executing OPEN LONG 0.04 BTC at market price $93,450', execution: { orderType: 'Market', fillPrice: 93450, decisionPrice: 93440, slippage: '+$10 (+0.01%)', latency: '245ms' } },
  ],
      pipeline: [
        { name: 'Research Signals', detail: '1H breakout detected', status: 'Strong' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'OPEN LONG 125.5 XRP @ $2.4920', status: 'Approved' },
        { name: 'Risk Post-check', detail: null, status: 'Approved' },
        { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
      ],
    },
    {
      id: 2,
      type: 'ADD',
      detail: '0.04 BTC $93,800',
      time: 'Today, 9:45 AM',
      prompt: 'Prompt v3',
      positionId: 21,
      pnl: 2.18,
      fee: -0.93,
      orders: [
        { type: 'Market Buy', size: '0.04 BTC', price: '93,800', time: '9:45:22 AM' },
        { type: 'Modify SL', size: 'SL → $93,200', price: 'breakeven', time: '9:45:23 AM' },
      ],
  researchAgents: [
  { name: 'Technical', confidence: 78, accuracy: 73, signal: 'BULLISH', description: 'Bullish engulfing on 4h. Breakout starting.', timeframe: '4H', signalType: 'Trend', horizon: 'Mid' },
  { name: 'Whale', confidence: 85, accuracy: 68, signal: 'BULLISH', description: '+$4.2M overnight accumulation.', timeframe: '24H', signalType: 'Momentum', horizon: 'Short' },
  { name: 'Sentiment', confidence: 55, accuracy: 65, signal: 'BULLISH', description: 'Still positive but weakening.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Position 0.04 BTC, +$20 profit. Room to add. All checks passed.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'ADD LONG', description: 'Agents remain BULLISH with high confidence. Trend confirmed. Adding 0.04 BTC → total 0.08 BTC (16% portfolio).', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.76, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'New position size acceptable. Total exposure within limits.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Trader', status: 'EXECUTED', description: 'Executing ADD LONG 0.04 BTC at market price $93,800.', execution: { orderType: 'Market', fillPrice: 93800, decisionPrice: 93790, slippage: '+$10 (+0.01%)', latency: '198ms' } },
  ],
      pipeline: [
        { name: 'Research Signals', detail: 'Momentum continuing', status: 'Strong' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'ADD 50 XRP + Move SL to breakeven', status: 'ADD' },
        { name: 'Risk Post-check', detail: null, status: 'Approved' },
        { name: 'Execution', detail: '2 Orders Filled', status: 'Filled' },
      ],
    },
    {
      id: 3,
      type: 'HOLD',
      detail: '— No action taken',
      time: 'Today, 10:15 AM',
      prompt: 'Prompt v3',
      positionId: 21,
      pnl: null,
      orders: [],
  researchAgents: [
  { name: 'Technical', confidence: 45, accuracy: 73, signal: 'NEUTRAL', description: 'Consolidating. No clear direction.', timeframe: '1H', signalType: 'Trend', horizon: 'Short' },
  { name: 'Whale', confidence: 52, accuracy: 68, signal: 'NEUTRAL', description: 'Mixed signals. Low activity.', timeframe: '24H', signalType: 'Momentum', horizon: 'Mid' },
  { name: 'Sentiment', confidence: 48, accuracy: 65, signal: 'NEUTRAL', description: 'Market undecided.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Position active. Monitoring.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'HOLD', description: 'No consensus from agents. Waiting for clearer signal.', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.48, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'No action required. State unchanged.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Trader', status: 'SKIPPED', description: 'No orders to execute. Holding position.' },
  ],
      pipeline: [
        { name: 'Research Signals', detail: 'No consensus (mixed)', status: 'Weak Signal' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'HOLD - Wait for confirmation', status: 'Hold' },
        { name: 'Risk Post-check', detail: null, status: 'Skipped' },
        { name: 'Execution', detail: null, status: 'No Order' },
      ],
    },
    {
      id: 7,
      type: 'REDUCE',
      detail: '0.02 BTC @ $94,100 — Take Partial Profit',
      time: 'Today, 11:00 AM',
      prompt: 'Prompt v3',
      positionId: 21,
      pnl: 32.50,
      fee: -0.47,
      orders: [{ type: 'Market Sell', size: '0.02 BTC', price: '94,100', time: '11:00:15 AM' }],
  researchAgents: [
  { name: 'Technical', confidence: 55, accuracy: 73, signal: 'NEUTRAL', description: 'Approaching resistance. Momentum slowing.', timeframe: '1H', signalType: 'Reversal', horizon: 'Short' },
  { name: 'Whale', confidence: 60, accuracy: 68, signal: 'NEUTRAL', description: 'Some profit-taking detected.', timeframe: '4H', signalType: 'Momentum', horizon: 'Mid' },
  { name: 'Sentiment', confidence: 50, accuracy: 65, signal: 'NEUTRAL', description: 'Sentiment cooling off.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Position in profit. Partial close allowed.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'REDUCE', description: 'Taking 25% profit at resistance. Reduce risk exposure.', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.55, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Reduced position size acceptable.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Trader', status: 'EXECUTED', description: 'Executing REDUCE 0.02 BTC at $94,100', execution: { orderType: 'Market', fillPrice: 94100, decisionPrice: 94110, slippage: '-$10 (-0.01%)', latency: '156ms' } },
  ],
      pipeline: [
        { name: 'Research Signals', detail: 'Resistance approaching', status: 'Caution' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'REDUCE 25% @ $94,100', status: 'Approved' },
        { name: 'Risk Post-check', detail: null, status: 'Approved' },
        { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
      ],
    },
    {
      id: 8,
      type: 'HOLD',
      detail: '— Waiting for breakout',
      time: 'Today, 12:00 PM',
      prompt: 'Prompt v3',
      positionId: 21,
      pnl: null,
      orders: [],
  researchAgents: [
  { name: 'Technical', confidence: 58, accuracy: 73, signal: 'BULLISH', description: 'Forming ascending triangle.', timeframe: '1H', signalType: 'Trend', horizon: 'Mid' },
  { name: 'Whale', confidence: 55, accuracy: 68, signal: 'NEUTRAL', description: 'Holding steady.', timeframe: '4H', signalType: 'Momentum', horizon: 'Mid' },
  { name: 'Sentiment', confidence: 52, accuracy: 65, signal: 'NEUTRAL', description: 'Awaiting news catalyst.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Position healthy. No changes needed.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'HOLD', description: 'Pattern forming. Wait for breakout confirmation.', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.55, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'State unchanged.' },
  { name: 'Trader', status: 'SKIPPED', description: 'No orders. Monitoring position.' },
  ],
      pipeline: [
        { name: 'Research Signals', detail: 'Pattern forming', status: 'Weak Signal' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'HOLD - Awaiting breakout', status: 'Hold' },
        { name: 'Risk Post-check', detail: null, status: 'Skipped' },
        { name: 'Execution', detail: null, status: 'No Order' },
      ],
    },
    {
      id: 4,
      type: 'OPEN LONG',
      detail: '100 XRP @ $2.5180',
      time: 'Yesterday, 8:15 AM',
      prompt: 'Prompt v2',
      positionId: 20,
      pnl: null,
      tp: '$2.6180',
      sl: '$2.4500',
      rr: '1:1.5',
      orders: [{ type: 'Market Buy', size: '100 XRP', price: '2.5180', time: '8:15:22 AM' }],
      researchAgents: [
        { name: 'Technical', confidence: 75, accuracy: 72, signal: 'BULLISH', description: 'RSI oversold bounce signal.' },
        { name: 'Whale', confidence: 70, accuracy: 68, signal: 'BULLISH', description: 'Whale accumulation on XRP.' },
        { name: 'Sentiment', confidence: 65, accuracy: 63, signal: 'BULLISH', description: 'Positive community sentiment.' },
      ],
      managerProcess: [
        { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Capital available. Risk within limits.' },
        { name: 'Portfolio Manager', action: 'OPEN LONG', description: 'Strong signals. Entry at support.' },
        { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Position size acceptable.' },
        { name: 'Trader', status: 'EXECUTED', description: 'Market buy 100 XRP @ $2.5180' },
      ],
      pipeline: [
        { name: 'Research Signals', detail: '3/3 Bullish consensus', status: 'Strong Signal' },
        { name: 'Risk Pre-check', detail: 'All checks passed', status: 'Approved' },
        { name: 'PM Proposal', detail: 'OPEN LONG 100 XRP', status: 'Approved' },
        { name: 'Risk Post-check', detail: 'Position validated', status: 'Approved' },
        { name: 'Execution', detail: 'Filled @ $2.5180', status: 'Executed' },
      ],
    },
    
    // Decisions for closed positions
    {
id: 5,
  type: 'OPEN LONG',
  detail: '2.0 ETH @ $3,280',
  time: '14:10',
  prompt: 'Prompt v3',
  positionId: 19,
  pnl: 156.30,
  fee: -2.10,
  tp: '$3,380',
  sl: '$3,200',
  rr: '1:1.25',
  orders: [{ type: 'Market Buy', size: '2.0 ETH', price: '3,280', time: '14:10:22' }],
  researchAgents: [
  { name: 'Technical', confidence: 72, accuracy: 71, signal: 'BULLISH', description: 'Strong support bounce on 1H.', timeframe: '1H', signalType: 'Reversal', horizon: 'Short' },
  { name: 'Whale', confidence: 68, accuracy: 66, signal: 'BULLISH', description: 'Large wallet accumulation detected.', timeframe: '24H', signalType: 'Momentum', horizon: 'Mid' },
  { name: 'Sentiment', confidence: 60, accuracy: 62, signal: 'NEUTRAL', description: 'Mixed social sentiment.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Capital available. Risk within limits.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'OPEN LONG', description: 'Strong technical + whale signals. Entry at support.', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.68, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Position size acceptable.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Trader', status: 'EXECUTED', description: 'Executed OPEN LONG 2.0 ETH at $3,280', execution: { orderType: 'Market', fillPrice: 3280, decisionPrice: 3278, slippage: '+$2 (+0.06%)', latency: '312ms' } },
  ],
      pipeline: [
        { name: 'Research Signals', detail: 'Support bounce', status: 'Strong' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'OPEN LONG 2.0 ETH @ $3,280', status: 'Approved' },
        { name: 'Risk Post-check', detail: null, status: 'Approved' },
        { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
      ],
    },
{
  id: 60,
  type: 'ADD',
  detail: '0.5 ETH @ $3,295 — Momentum Confirmed',
  time: '14:15',
  prompt: 'Prompt v3',
  positionId: 19,
  pnl: null,
  fee: -0.82,
  orders: [{ type: 'Market Buy', size: '0.5 ETH', price: '3,295', time: '14:15:22' }],
  researchAgents: [
  { name: 'Technical', confidence: 78, accuracy: 74, signal: 'BULLISH', description: 'Momentum increasing. Adding to position.', timeframe: '15M', signalType: 'Momentum', horizon: 'Short' },
  { name: 'Whale', confidence: 72, accuracy: 68, signal: 'BULLISH', description: 'Large buyer detected.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  { name: 'Sentiment', confidence: 70, accuracy: 65, signal: 'BULLISH', description: 'Positive momentum.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Position in profit. Add allowed.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'ADD', description: 'Momentum confirmed. Increase position 25%.', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.74, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'New size within limits.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Trader', status: 'EXECUTED', description: 'ADD 0.5 ETH @ $3,295', execution: { orderType: 'Market', fillPrice: 3295, decisionPrice: 3293, slippage: '+$2 (+0.06%)', latency: '205ms' } },
  ],
  pipeline: [
  { name: 'Research Signals', detail: 'Strong bullish consensus', status: 'Strong' },
  { name: 'Risk Pre-check', detail: null, status: 'Passed' },
  { name: 'PM Proposal', detail: 'ADD 0.5 ETH', status: 'Approved' },
  { name: 'Risk Post-check', detail: null, status: 'Approved' },
  { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
  ],
  },
  {
  id: 61,
  type: 'HOLD',
  detail: '— Waiting for TP',
  time: '14:20',
  prompt: 'Prompt v3',
  positionId: 19,
  pnl: null,
  orders: [],
  researchAgents: [
  { name: 'Technical', confidence: 68, accuracy: 74, signal: 'BULLISH', description: 'Approaching target. Hold position.', timeframe: '15M', signalType: 'Trend', horizon: 'Short' },
  { name: 'Whale', confidence: 65, accuracy: 68, signal: 'NEUTRAL', description: 'Activity slowing.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  { name: 'Sentiment', confidence: 62, accuracy: 65, signal: 'NEUTRAL', description: 'Market consolidating.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Position healthy.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'HOLD', description: 'Near TP. Wait for target hit.', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.65, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'SKIPPED', description: 'No action needed.' },
  { name: 'Trader', status: 'SKIPPED', description: 'No orders. Monitoring.' },
  ],
  pipeline: [
  { name: 'Research Signals', detail: 'Mixed signals near target', status: 'Weak Signal' },
  { name: 'Risk Pre-check', detail: null, status: 'Passed' },
  { name: 'PM Proposal', detail: 'HOLD - Near TP', status: 'Hold' },
  { name: 'Risk Post-check', detail: null, status: 'Skipped' },
  { name: 'Execution', detail: null, status: 'No Order' },
  ],
  },
  {
  id: 62,
  type: 'REDUCE',
  detail: '0.5 ETH @ $3,305 — Partial Profit',
  time: '14:28',
  prompt: 'Prompt v3',
  positionId: 19,
  pnl: 12.50,
  fee: -0.83,
  orders: [{ type: 'Market Sell', size: '0.5 ETH', price: '3,305', time: '14:28:15' }],
  researchAgents: [
  { name: 'Technical', confidence: 58, accuracy: 74, signal: 'NEUTRAL', description: 'Momentum slowing at resistance.', timeframe: '15M', signalType: 'Reversal', horizon: 'Short' },
  { name: 'Whale', confidence: 55, accuracy: 68, signal: 'NEUTRAL', description: 'Some profit taking.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  { name: 'Sentiment', confidence: 52, accuracy: 65, signal: 'NEUTRAL', description: 'Uncertainty increasing.', timeframe: '1H', signalType: 'Momentum', horizon: 'Short' },
  ],
  managerProcess: [
  { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Position in profit. Partial close allowed.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Portfolio Manager', action: 'REDUCE', description: 'Taking 25% profit near resistance.', aggregation: { method: 'Weighted Average', weights: { Technical: 0.4, Whale: 0.35, Sentiment: 0.25 }, score: 0.55, threshold: 0.68 } },
  { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Reduced exposure acceptable.', checks: [{ name: 'Position size', passed: true }, { name: 'Exposure limit', passed: true }, { name: 'Correlation risk', passed: true }, { name: 'Max loss', passed: true }] },
  { name: 'Trader', status: 'EXECUTED', description: 'REDUCE 0.5 ETH @ $3,305', execution: { orderType: 'Market', fillPrice: 3305, decisionPrice: 3307, slippage: '-$2 (-0.06%)', latency: '178ms' } },
  ],
  pipeline: [
  { name: 'Research Signals', detail: 'Momentum weakening', status: 'Caution' },
  { name: 'Risk Pre-check', detail: null, status: 'Passed' },
  { name: 'PM Proposal', detail: 'REDUCE 25%', status: 'Approved' },
  { name: 'Risk Post-check', detail: null, status: 'Approved' },
  { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
  ],
  },
  {
  id: 6,
  type: 'CLOSE LONG',
  detail: '2.0 ETH @ $3,310 — TP Hit',
  time: '14:32',
  prompt: 'Prompt v3',
  positionId: 19,
  pnl: 156.30,
  fee: -2.15,
  orders: [{ type: 'Market Sell', size: '2.0 ETH', price: '3,310', time: '14:32:05' }],
  pipeline: [
  { name: 'TP Trigger', detail: 'Price hit $3,310 target', status: 'Triggered' },
  { name: 'Execution', detail: 'Market sell executed', status: 'Filled' },
  ],
  },
    {
id: 7,
  type: 'OPEN LONG',
  detail: '100 LINK @ $14.50',
  time: '13:00',
  prompt: 'Prompt v3',
  positionId: 18,
  pnl: 78.50,
  fee: -1.20,
  tp: '$14.95',
  sl: '$14.15',
  rr: '1:1.3',
  orders: [{ type: 'Market Buy', size: '100 LINK', price: '14.50', time: '13:00:18' }],
      researchAgents: [
        { name: 'Technical', confidence: 75, accuracy: 70, signal: 'BULLISH', description: 'Breakout above resistance.' },
        { name: 'Whale', confidence: 70, accuracy: 65, signal: 'BULLISH', description: 'Institutional buying detected.' },
        { name: 'Sentiment', confidence: 65, accuracy: 63, signal: 'BULLISH', description: 'Positive ecosystem news.' },
      ],
      managerProcess: [
        { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'All checks passed.' },
        { name: 'Portfolio Manager', action: 'OPEN LONG', description: 'Strong consensus across agents.' },
        { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Position within limits.' },
        { name: 'Trader', status: 'EXECUTED', description: 'Executed OPEN LONG 100 LINK at $14.50' },
      ],
      pipeline: [
        { name: 'Research Signals', detail: 'Breakout confirmed', status: 'Strong' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'OPEN LONG 100 LINK @ $14.50', status: 'Approved' },
        { name: 'Risk Post-check', detail: null, status: 'Approved' },
        { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
      ],
    },
    {
      id: 8,
      type: 'CLOSE LONG',
      detail: '100 LINK @ $14.72 — TP Hit',
      time: '13:15',
      prompt: 'Prompt v3',
      positionId: 18,
      pnl: 78.50,
      fee: -1.22,
      orders: [{ type: 'Market Sell', size: '100 LINK', price: '14.72', time: '13:15:30' }],
      pipeline: [
        { name: 'TP Trigger', detail: 'Price hit $14.72 target', status: 'Triggered' },
        { name: 'Execution', detail: 'Market sell executed', status: 'Filled' },
      ],
    },
    {
id: 9,
  type: 'OPEN SHORT',
  detail: '10,000 DOGE @ $0.082',
  time: '12:30',
  prompt: 'Prompt v2',
  positionId: 17,
  pnl: -34.20,
  fee: -0.85,
  tp: '$0.0780',
  sl: '$0.0850',
  rr: '1:1.3',
  orders: [{ type: 'Market Sell', size: '10,000 DOGE', price: '0.082', time: '12:30:45' }],
      researchAgents: [
        { name: 'Technical', confidence: 62, accuracy: 68, signal: 'BEARISH', description: 'Rejection at resistance.' },
        { name: 'Whale', confidence: 55, accuracy: 60, signal: 'NEUTRAL', description: 'Mixed whale activity.' },
        { name: 'Sentiment', confidence: 48, accuracy: 58, signal: 'BEARISH', description: 'Declining social interest.' },
      ],
      managerProcess: [
        { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Short position allowed.' },
        { name: 'Portfolio Manager', action: 'OPEN SHORT', description: 'Technical bearish signal. Small position.' },
        { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Risk acceptable.' },
        { name: 'Trader', status: 'EXECUTED', description: 'Executed OPEN SHORT 10,000 DOGE at $0.082' },
      ],
      pipeline: [
        { name: 'Research Signals', detail: 'Bearish rejection', status: 'Moderate' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'OPEN SHORT 10,000 DOGE @ $0.082', status: 'Approved' },
        { name: 'Risk Post-check', detail: null, status: 'Approved' },
        { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
      ],
    },
    {
      id: 10,
      type: 'CLOSE SHORT',
      detail: '10,000 DOGE @ $0.0827 — SL Hit',
      time: '12:45',
      prompt: 'Prompt v2',
      positionId: 17,
      pnl: -34.20,
      fee: -0.86,
      orders: [{ type: 'Market Buy', size: '10,000 DOGE', price: '0.0827', time: '12:45:12' }],
      pipeline: [
        { name: 'SL Trigger', detail: 'Price hit $0.0827 stop loss', status: 'Triggered' },
        { name: 'Execution', detail: 'Market buy executed', status: 'Filled' },
      ],
    },
    {
id: 11,
  type: 'OPEN LONG',
  detail: '500 ARB @ $1.12',
  time: '11:15',
  prompt: 'Prompt v2',
  positionId: 16,
  pnl: -45.80,
  fee: -0.95,
  tp: '$1.18',
  sl: '$1.08',
  rr: '1:1.5',
  orders: [{ type: 'Market Buy', size: '500 ARB', price: '1.12', time: '11:15:33' }],
      researchAgents: [
        { name: 'Technical', confidence: 58, accuracy: 65, signal: 'BULLISH', description: 'Potential reversal pattern.' },
        { name: 'Whale', confidence: 45, accuracy: 58, signal: 'NEUTRAL', description: 'Low whale activity.' },
        { name: 'Sentiment', confidence: 52, accuracy: 55, signal: 'NEUTRAL', description: 'Neutral market mood.' },
      ],
      managerProcess: [
        { name: 'Risk Manager', role: 'Pre-check', status: 'WARNING', description: 'Low confidence signals. Proceeding with caution.' },
        { name: 'Portfolio Manager', action: 'OPEN LONG', description: 'Weak bullish signal. Small speculative position.' },
        { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Small position size acceptable.' },
        { name: 'Trader', status: 'EXECUTED', description: 'Executed OPEN LONG 500 ARB at $1.12' },
      ],
      pipeline: [
        { name: 'Research Signals', detail: 'Weak bullish', status: 'Weak Signal' },
        { name: 'Risk Pre-check', detail: 'Low confidence warning', status: 'Warning' },
        { name: 'PM Proposal', detail: 'OPEN LONG 500 ARB @ $1.12', status: 'Approved' },
        { name: 'Risk Post-check', detail: null, status: 'Approved' },
        { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
      ],
    },
    {
      id: 12,
      type: 'LIQUIDATED',
      detail: '500 ARB @ $1.106 — Liquidated',
      time: '11:30',
      prompt: 'Prompt v2',
      positionId: 16,
      pnl: -45.80,
      fee: -1.50,
      orders: [{ type: 'Forced Liquidation', size: '500 ARB', price: '1.106', time: '11:30:00' }],
      pipeline: [
        { name: 'Margin Warning', detail: 'Margin level critical', status: 'Warning' },
        { name: 'Liquidation', detail: 'Position liquidated at $1.106', status: 'Liquidated' },
      ],
    },
    {
id: 13,
  type: 'OPEN LONG',
  detail: '30 AVAX @ $35.20',
  time: '10:00',
  prompt: 'Prompt v2',
  positionId: 15,
  pnl: 112.40,
  fee: -1.80,
  tp: '$36.50',
  sl: '$34.20',
  rr: '1:1.3',
  orders: [{ type: 'Market Buy', size: '30 AVAX', price: '35.20', time: '10:00:15' }],
      researchAgents: [
        { name: 'Technical', confidence: 80, accuracy: 74, signal: 'BULLISH', description: 'Strong momentum breakout.' },
        { name: 'Whale', confidence: 75, accuracy: 70, signal: 'BULLISH', description: 'Major accumulation phase.' },
        { name: 'Sentiment', confidence: 70, accuracy: 68, signal: 'BULLISH', description: 'High community engagement.' },
      ],
      managerProcess: [
        { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Strong signals. Full position allowed.' },
        { name: 'Portfolio Manager', action: 'OPEN LONG', description: 'High confidence across all agents. Taking full position.' },
        { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Position size optimal.' },
        { name: 'Trader', status: 'EXECUTED', description: 'Executed OPEN LONG 30 AVAX at $35.20' },
      ],
      pipeline: [
        { name: 'Research Signals', detail: 'Strong momentum', status: 'Strong' },
        { name: 'Risk Pre-check', detail: null, status: 'Passed' },
        { name: 'PM Proposal', detail: 'OPEN LONG 30 AVAX @ $35.20', status: 'Approved' },
        { name: 'Risk Post-check', detail: null, status: 'Approved' },
        { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
      ],
    },
    {
      id: 14,
      type: 'CLOSE LONG',
      detail: '30 AVAX @ $36.35 — TP Hit',
      time: '10:15',
      prompt: 'Prompt v2',
      positionId: 15,
      pnl: 112.40,
      fee: -1.85,
      orders: [{ type: 'Market Sell', size: '30 AVAX', price: '36.35', time: '10:15:42' }],
      pipeline: [
        { name: 'TP Trigger', detail: 'Price hit $36.35 target', status: 'Triggered' },
        { name: 'Execution', detail: 'Market sell executed', status: 'Filled' },
      ],
    },
  ]

  const currentPosition = {
    id: 21,
    symbol: 'XRPUSDT',
    side: 'LONG',
    size: '125.5 XRP',
    entry: 2.4920,
    current: 2.5480,
    pnl: 7.03,
    pnlPercent: 2.25,
    sl: 2.4420,
    tp: 2.6180,
    holding: '5h 45m',
  }

  const positionHistory = [
    // Active positions
    { id: 21, symbol: 'XRP/USDT', side: 'LONG', entry: 2.4920, exit: null, pnl: 87.03, pnlPercent: 2.25, size: '125.5 XRP', duration: '5h 45m', exitType: null, prompt: 'v3', date: 'Today', active: true },
    { id: 20, symbol: 'BTC/USDT', side: 'LONG', entry: 93450, exit: null, pnl: 517.80, pnlPercent: 1.8, size: '0.04 BTC', duration: '2h 15m', exitType: null, prompt: 'v3', date: 'Today', active: true },
    // Closed positions
    { id: 19, symbol: 'ETH/USDT', side: 'LONG', entry: 3280, exit: 3310, pnl: 156.30, pnlPercent: 2.8, size: '2.0 ETH', duration: '1h 20m', exitType: null, prompt: 'v3', date: '14:32', active: false },
    { id: 18, symbol: 'LINK/USDT', side: 'LONG', entry: 14.50, exit: 14.72, pnl: 78.50, pnlPercent: 1.5, size: '100 LINK', duration: '45m', exitType: null, prompt: 'v3', date: '13:15', active: false },
    { id: 17, symbol: 'DOGE/USDT', side: 'SHORT', entry: 0.082, exit: 0.0827, pnl: -34.20, pnlPercent: -0.8, size: '10,000 DOGE', duration: '30m', exitType: null, prompt: 'v2', date: '12:45', active: false },
    { id: 16, symbol: 'ARB/USDT', side: 'LONG', entry: 1.12, exit: 1.106, pnl: -45.80, pnlPercent: -1.2, size: '500 ARB', duration: '1h 10m', exitType: 'Liquidated', prompt: 'v2', date: '11:30', active: false },
    { id: 15, symbol: 'AVAX/USDT', side: 'LONG', entry: 35.20, exit: 36.35, pnl: 112.40, pnlPercent: 3.2, size: '30 AVAX', duration: '2h 5m', exitType: null, prompt: 'v2', date: '10:15', active: false },
  ]
  
  // Hold decisions (no trade executed, agent decided to hold)
  const holdDecisions = [
    { id: 'hold-1', symbol: 'ETH/USDT', time: '16:45', reason: 'Weak signal - waiting for confirmation', confidence: 45 },
    { id: 'hold-2', symbol: 'SOL/USDT', time: '15:30', reason: 'High volatility - risk too high', confidence: 38 },
    { id: 'hold-3', symbol: 'BTC/USDT', time: '14:15', reason: 'No clear trend direction', confidence: 52 },
  ]

  const runHistory = [
    { 
      id: '1ad06abd-629', 
      status: 'succeeded', 
      time: 'Jan 20, 05:28 PM', 
      symbol: 'XRPUSDT', 
      duration: '1m 39s', 
      decision: 'OPEN LONG', 
      prompt: 'v3',
      decisionData: {
        type: 'OPEN LONG',
        detail: '0.04 BTC $93,450',
        positionId: 21,
        pnl: 7.03,
        fee: -0.93,
        orders: [{ type: 'Market Buy', size: '0.04 BTC', price: '93,450', time: '9:30:15 AM' }],
        researchAgents: [
          { name: 'Technical', confidence: 78, accuracy: 73, signal: 'BULLISH', description: 'Bullish engulfing on 4h. Breakout starting.' },
          { name: 'Whale', confidence: 85, accuracy: 68, signal: 'BULLISH', description: '+$4.2M overnight accumulation.' },
          { name: 'Sentiment', confidence: 55, accuracy: 65, signal: 'NEUTRAL', description: '+$4.2M overnight accumulation.' },
        ],
        managerProcess: [
          { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'No position. First trade of session. Checks passed.' },
          { name: 'Portfolio Manager', action: 'OPEN LONG', description: '3/4 agents BULLISH. Starting 0.04 BTC (8% capital).' },
          { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'Position size within limits. Risk/reward acceptable.' },
          { name: 'Trader', status: 'EXECUTED', description: 'Executing OPEN LONG 0.04 BTC at market price $93,450' },
        ],
        pipeline: [
          { name: 'Research Signals', detail: '1H breakout detected', status: 'Strong' },
          { name: 'Risk Pre-check', detail: null, status: 'Passed' },
          { name: 'PM Proposal', detail: 'OPEN LONG 125.5 XRP @ $2.4920', status: 'Approved' },
          { name: 'Risk Post-check', detail: null, status: 'Approved' },
          { name: 'Execution', detail: '1 Order Filled', status: 'Filled' },
        ],
      }
    },
    { 
      id: 'ba7ecff2-a8c', 
      status: 'succeeded', 
      time: 'Jan 20, 05:12 PM', 
      symbol: 'XRPUSDT', 
      duration: '4m 31s', 
      decision: 'ADD', 
      prompt: 'v3',
      decisionData: {
        type: 'ADD',
        detail: '0.04 BTC $93,800',
        positionId: 21,
        pnl: 2.18,
        fee: -0.93,
        orders: [
          { type: 'Market Buy', size: '0.04 BTC', price: '93,800', time: '9:45:22 AM' },
          { type: 'Modify SL', size: 'SL → $93,200', price: 'breakeven', time: '9:45:23 AM' },
        ],
        researchAgents: [
          { name: 'Technical', confidence: 78, accuracy: 73, signal: 'BULLISH', description: 'Bullish engulfing on 4h. Breakout starting.' },
          { name: 'Whale', confidence: 85, accuracy: 68, signal: 'BULLISH', description: '+$4.2M overnight accumulation.' },
          { name: 'Sentiment', confidence: 55, accuracy: 65, signal: 'BULLISH', description: 'Still positive but weakening.' },
        ],
        managerProcess: [
          { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'Position 0.04 BTC, +$20 profit. Room to add. All checks passed.' },
          { name: 'Portfolio Manager', action: 'ADD LONG', description: 'Agents remain BULLISH with high confidence. Trend confirmed. Adding 0.04 BTC → total 0.08 BTC (16% portfolio).' },
          { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'New position size acceptable. Total exposure within limits.' },
          { name: 'Trader', status: 'EXECUTED', description: 'Executing ADD LONG 0.04 BTC at market price $93,800.' },
        ],
        pipeline: [
          { name: 'Research Signals', detail: 'Momentum continuing', status: 'Strong' },
          { name: 'Risk Pre-check', detail: null, status: 'Passed' },
          { name: 'PM Proposal', detail: 'ADD 50 XRP + Move SL to breakeven', status: 'ADD' },
          { name: 'Risk Post-check', detail: null, status: 'Approved' },
          { name: 'Execution', detail: '2 Orders Filled', status: 'Filled' },
        ],
      }
    },
    { 
      id: 'e71eb117-564', 
      status: 'succeeded', 
      time: 'Jan 20, 04:56 PM', 
      symbol: 'XRPUSDT', 
      duration: '2m 19s', 
      decision: 'HOLD', 
      prompt: 'v3',
      decisionData: {
        type: 'HOLD',
        detail: '— No action taken',
        positionId: 21,
        pnl: null,
        orders: [],
        researchAgents: [
          { name: 'Technical', confidence: 45, accuracy: 73, signal: 'NEUTRAL', description: 'Consolidating. No clear direction.' },
          { name: 'Whale', confidence: 52, accuracy: 68, signal: 'NEUTRAL', description: 'Mixed signals. Low activity.' },
          { name: 'Sentiment', confidence: 48, accuracy: 65, signal: 'NEUTRAL', description: 'Market undecided.' },
        ],
        managerProcess: [
          { name: 'Risk Manager', role: 'Pre-check', status: 'APPROVED', description: 'No active position. Checks passed.' },
          { name: 'Portfolio Manager', action: 'HOLD', description: 'No consensus from agents. Waiting for clearer signal.' },
          { name: 'Risk Manager', role: 'Post-check', status: 'APPROVED', description: 'No action required. State unchanged.' },
          { name: 'Trader', status: 'EXECUTED', description: 'No orders to execute. Holding.' },
        ],
        pipeline: [
          { name: 'Research Signals', detail: 'No consensus (5/3 Bullish)', status: 'Weak Signal' },
          { name: 'Risk Pre-check', detail: null, status: 'Skipped' },
          { name: 'PM Proposal', detail: null, status: 'Skipped' },
          { name: 'Risk Post-check', detail: null, status: 'Skipped' },
          { name: 'Execution', detail: null, status: 'No Order' },
        ],
      }
    },
    { 
      id: '755bdc97-d39', 
      status: 'succeeded', 
      time: 'Jan 20, 04:40 PM', 
      symbol: 'XRPUSDT', 
      duration: '1m 52s', 
      decision: 'HOLD', 
      prompt: 'v2',
      decisionData: null
    },
    { 
      id: '26449456-106', 
      status: 'failed', 
      time: 'Jan 20, 03:52 PM', 
      symbol: 'XRPUSDT', 
      duration: '3m 21s', 
      decision: 'ERROR', 
      prompt: 'v2',
      decisionData: null
    },
    { 
      id: '849c79a6-559', 
      status: 'succeeded', 
      time: 'Jan 20, 03:36 PM', 
      symbol: 'XRPUSDT', 
      duration: '5m 0s', 
      decision: 'CLOSE LONG', 
      prompt: 'v2',
      decisionData: {
        type: 'CLOSE LONG',
        detail: '— Take Profit Hit',
        positionId: 20,
        pnl: 12.50,
        orders: [{ type: 'Market Sell', size: '100 XRP', price: '2.6180', time: '9:22:05 PM' }],
        pipeline: [
          { name: 'TP Trigger', detail: 'Price hit $2.6180 target', status: 'Triggered' },
          { name: 'Execution', detail: 'Market sell executed', status: 'Filled' },
        ],
      }
    },
  ]

return (
  <div style={{
  minHeight: '100vh',
  backgroundColor: '#0a0f0d',
  color: '#e8e8e8',
  fontFamily: "'Inter', -apple-system, sans-serif",
  padding: '20px 16px',
  }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/trading-terminal" style={{
            background: 'none',
            border: 'none',
            color: '#6b7c74',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
          }}>
            <ArrowLeft size={16} /> My Agents
          </Link>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: 0,
            fontFamily: "'JetBrains Mono', monospace",
          }}>felix_test1</h1>
          <span style={{
            padding: '4px 10px',
            borderRadius: '4px',
            backgroundColor: '#0d2818',
            color: '#22c55e',
            fontSize: '11px',
            fontWeight: '600',
          }}>● Running</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setShowConfigModal(true)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: '#1a2420',
              border: '1px solid #2d3d36',
              color: '#e8e8e8',
              cursor: 'pointer',
              fontSize: '13px',
            }}>⚙ Configuration</button>
          <button 
            onClick={handleRunNow}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              backgroundColor: '#22c55e',
              border: 'none',
              color: '#0a0f0d',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
            }}>▷ Run Now</button>
        </div>
      </header>

{/* Force Liquidation Modal */}
      {showLiquidationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: '#0d1210',
            borderRadius: '16px',
            border: '1px solid #1a2420',
            width: '440px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a2420' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>&#9888;</span>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#e8e8e8' }}>Confirm Liquidation</span>
              </div>
            </div>
            
{/* Position Details */}
  <div style={{ padding: '20px 24px' }}>
  <div style={{
  backgroundColor: '#141a17',
  borderRadius: '12px',
  padding: '16px 20px',
  marginBottom: '20px',
  }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
  <span style={{ fontSize: '13px', color: '#6b7c74' }}>Trading Pair</span>
  <span style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8e8' }}>{currentPosition.symbol}</span>
  </div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span style={{ fontSize: '13px', color: '#6b7c74' }}>Direction</span>
  <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>LONG</span>
  </div>
  </div>
  
  {/* Info Message */}
  <div style={{
  backgroundColor: '#141a17',
  borderRadius: '12px',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
              }}>
<div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
  This position will be closed immediately at current market price. The PM decisions will automatically detect this change.
  </div>
              </div>
            </div>
            
            {/* Footer Buttons */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #1a2420',
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={() => setShowLiquidationModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #3a3a48',
                  color: '#e8e8e8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >Cancel</button>
              <button
                onClick={handleConfirmLiquidation}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: '#ef4444',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >Confirm Liquidation</button>
            </div>
          </div>
        </div>
      )}

  {/* Liquidate All Modal */}
      {showLiquidateAllModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: '#0d1210',
            borderRadius: '16px',
            border: '1px solid #1a2420',
            width: '440px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a2420' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>&#9888;</span>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#e8e8e8' }}>Confirm Liquidation</span>
              </div>
            </div>
            
            {/* Position Details */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{
                backgroundColor: '#141a17',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#6b7c74' }}>Action</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>LIQUIDATE ALL POSITIONS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#6b7c74' }}>Affected Positions</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#e8e8e8' }}>{currentPosition.symbol} (and all open)</span>
                </div>
              </div>
              
              {/* Info Message */}
              <div style={{
                backgroundColor: '#141a17',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
                  All open positions will be closed immediately at current market price. The PM decisions will automatically detect this change.
                </div>
              </div>
            </div>
            
            {/* Footer Buttons */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #1a2420',
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={() => setShowLiquidateAllModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #3a3a48',
                  color: '#e8e8e8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >Cancel</button>
              <button
                onClick={() => {
                  setShowLiquidateAllModal(false)
                  alert('All positions closed at market price.')
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: '#ef4444',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >Confirm Liquidation</button>
            </div>
          </div>
        </div>
      )}

  {/* Configuration Modal */}
  {showConfigModal && (
  <div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#0d1210',
            borderRadius: '12px',
            border: '1px solid #1a2420',
            padding: '24px',
            width: '480px',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Agent Configuration</h2>
              <button 
                onClick={() => setShowConfigModal(false)}
                style={{ background: 'none', border: 'none', color: '#6b7c74', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#6b7c74', display: 'block', marginBottom: '8px' }}>Trading Pair</label>
                <select style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#141a17',
                  border: '1px solid #2d3d36',
                  borderRadius: '6px',
                  color: '#e8e8e8',
                  fontSize: '13px',
                }}>
                  <option>XRPUSDT</option>
                  <option>BTCUSDT</option>
                  <option>ETHUSDT</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#6b7c74', display: 'block', marginBottom: '8px' }}>Run Interval</label>
                <select style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#141a17',
                  border: '1px solid #2d3d36',
                  borderRadius: '6px',
                  color: '#e8e8e8',
                  fontSize: '13px',
                }}>
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Every 1 hour</option>
                  <option>Every 4 hours</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#6b7c74', display: 'block', marginBottom: '8px' }}>Max Position Size</label>
                <input 
                  defaultValue="500"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#141a17',
                    border: '1px solid #2d3d36',
                    borderRadius: '6px',
                    color: '#e8e8e8',
                    fontSize: '13px',
                  }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#6b7c74', display: 'block', marginBottom: '8px' }}>Risk Level</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Conservative', 'Balanced', 'Aggressive'].map(level => (
                    <button 
                      key={level}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        backgroundColor: level === 'Balanced' ? '#0d2818' : '#141a17',
                        border: level === 'Balanced' ? '1px solid #22c55e' : '1px solid #2d3d36',
                        color: level === 'Balanced' ? '#22c55e' : '#6b7c74',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}>{level}</button>
                  ))}
                </div>
              </div>
              
              {/* Research Agents Section */}
              <div style={{ 
                borderTop: '1px solid #2d3d36', 
                paddingTop: '16px', 
                marginTop: '8px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: '#e8e8e8', fontWeight: '500' }}>Research Agents</label>
                  <button style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor: '#0d2818',
                    border: '1px solid #22c55e33',
                    color: '#22c55e',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}>+ Add Agent</button>
                </div>
                
                {/* Agent List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'Technical Analysis', description: 'Analyzes price action, patterns, and technical indicators' },
                    { name: 'Whale Tracker', description: 'Monitors large wallet movements and accumulation patterns' },
                    { name: 'Sentiment Analysis', description: 'Analyzes social media and news sentiment' },
                  ].map((agent, i) => (
                    <div key={i} style={{
                      padding: '12px',
                      backgroundColor: '#141a17',
                      borderRadius: '8px',
                      border: '1px solid #2d3d36',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <input 
                          defaultValue={agent.name}
                          placeholder="Agent Name"
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            backgroundColor: '#0d1210',
                            border: '1px solid #2d3d36',
                            borderRadius: '4px',
                            color: '#e8e8e8',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        />
                        <button style={{
                          marginLeft: '8px',
                          padding: '6px 10px',
                          backgroundColor: 'transparent',
                          border: '1px solid #ef444466',
                          borderRadius: '4px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}>Remove</button>
                      </div>
                      <textarea 
                        defaultValue={agent.description}
                        placeholder="Agent Description - What does this agent analyze?"
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          backgroundColor: '#0d1210',
                          border: '1px solid #2d3d36',
                          borderRadius: '4px',
                          color: '#e8e8e8',
                          fontSize: '12px',
                          resize: 'none',
                          lineHeight: '1.4',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setShowConfigModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid #2d3d36',
                  color: '#e8e8e8',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}>Cancel</button>
              <button 
                onClick={() => { setShowConfigModal(false); alert('Configuration saved!'); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: '#22c55e',
                  border: 'none',
                  color: '#0a0f0d',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        backgroundColor: '#0d1210',
        padding: '4px',
        borderRadius: '8px',
        width: 'fit-content',
      }}>
        {[
          { id: 'live', label: 'Live' },
          { id: 'history', label: 'History' },
          { id: 'statistics', label: 'Statistics' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpandedDecision(null); }}
            style={{
              padding: '10px 32px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#22c55e' : 'transparent',
              color: activeTab === tab.id ? '#0a0f0d' : '#6b7c74',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area - Full Width */}
      <div>
        {/* Live Tab */}
        {activeTab === 'live' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Sub-tabs */}
            <div style={{
              display: 'flex',
              gap: '0',
              backgroundColor: '#0d1210',
              borderRadius: '8px',
              border: '1px solid #1a2420',
              padding: '4px',
            }}>
              {[
                { id: 'positions' as const, label: 'Current Positions', count: [...new Set(positions.map(p => p.coin))].length },
                { id: 'orders' as const, label: 'Open Orders', count: 6 },
                { id: 'run' as const, label: 'Current Run', badge: 'In Progress' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setLiveSubTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: liveSubTab === tab.id ? '#1a2420' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: liveSubTab === tab.id ? '#e8e8e8' : '#6b7c74',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: liveSubTab === tab.id ? '600' : '400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: liveSubTab === tab.id ? '#0d2818' : '#141a17',
                      color: liveSubTab === tab.id ? '#22c55e' : '#6b7c74',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>{tab.count}</span>
                  )}
                  {tab.badge && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: '#2d2810',
                      color: '#f59e0b',
                      fontSize: '10px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'pulse 2s infinite' }} />
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Current Positions Sub-tab */}
            {liveSubTab === 'positions' && (() => {
              // Group positions by coin - aggregate into one card per token
              const grouped = positions.reduce((acc: Record<string, typeof positions>, pos) => {
                if (!acc[pos.coin]) acc[pos.coin] = []
                acc[pos.coin].push(pos)
                return acc
              }, {})
              const filteredCoins = positionFilter === 'all' ? Object.keys(grouped) : Object.keys(grouped).filter(c => c === positionFilter)

              return (
              <div style={{
                backgroundColor: '#0d1210',
                borderRadius: '12px',
                border: '1px solid #1a2420',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: '1px solid #1a2420',
                }}>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>Current Positions ({filteredCoins.length} tokens)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {['all', ...Object.keys(grouped)].map(sym => (
                      <button
                        key={sym}
                        onClick={() => setPositionFilter(sym)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '4px',
                          backgroundColor: positionFilter === sym ? '#1a2420' : 'transparent',
                          border: positionFilter === sym ? '1px solid #2d3d36' : '1px solid transparent',
                          color: positionFilter === sym ? '#e8e8e8' : '#6b7c74',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: positionFilter === sym ? '500' : '400',
                        }}
                      >{sym === 'all' ? 'All' : sym}</button>
                    ))}
                  </div>
                </div>

                {/* Grouped Position Cards */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {filteredCoins.map(coin => {
                    const coinPositions = grouped[coin]
                    // Net aggregation
                    const totalPnl = coinPositions.reduce((s, p) => s + p.pnl, 0)
                    const isExpanded = expandedLivePos === coin
                    // Use first position for representative values (primary position)
                    const primary = coinPositions[0]
                    // Calculate distance to TP and SL
                    const distToTp = primary.side === 'LONG'
                      ? ((primary.tp - primary.current) / primary.current * 100)
                      : ((primary.current - primary.tp) / primary.current * 100)
                    const distToSl = primary.side === 'LONG'
                      ? ((primary.current - primary.sl) / primary.current * 100)
                      : ((primary.sl - primary.current) / primary.current * 100)
                    const rr = distToSl > 0 ? (distToTp / distToSl).toFixed(2) : '0'

                    // Get the latest decision for this position only
                    const coinDecisions = decisions.filter(d => {
                      const detail = d.detail?.toLowerCase() || ''
                      return detail.includes(coin.toLowerCase())
                    })
                    const latestDecision = coinDecisions.length > 0 ? coinDecisions[coinDecisions.length - 1] : null

                    return (
                      <div key={coin} style={{ borderBottom: '1px solid #1a2420' }}>
                        {/* Coin Row - Clickable */}
                        <div
                          onClick={() => { setExpandedLivePos(isExpanded ? null : coin); setExpandedLivePosDecision(null) }}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '18px 20px',
                            cursor: 'pointer',
                            backgroundColor: isExpanded ? '#141a17' : 'transparent',
                            transition: 'background-color 0.15s',
                          }}
                        >
                          {/* Left Side - All info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            {/* Coin + Side */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontWeight: '700', fontSize: '18px' }}>{coin}</span>
                              <span style={{
                                display: 'inline-flex',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                backgroundColor: primary.side === 'LONG' ? '#0d2818' : '#2d1f1f',
                                color: primary.side === 'LONG' ? '#22c55e' : '#ef4444',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}>{primary.side === 'LONG' ? '↗' : '↘'} {primary.side}</span>
                            </div>

                            <div style={{ width: '1px', height: '28px', backgroundColor: '#1a2420' }} />

                            {/* Size + Entry -> Current */}
                            <div style={{ fontSize: '15px' }}>
                              <span style={{ color: '#a0a0a0' }}>{primary.size}</span>
                              <span style={{ color: '#6b7c74', margin: '0 8px' }}>@</span>
                              <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>${primary.entry.toLocaleString()}</span>
                              <span style={{ color: '#6b7c74', margin: '0 8px' }}>{'\u2192'}</span>
                              <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>${primary.current.toLocaleString()}</span>
                            </div>

                            <div style={{ width: '1px', height: '28px', backgroundColor: '#1a2420' }} />

                            {/* PnL */}
                            <div style={{
                              color: totalPnl >= 0 ? '#22c55e' : '#ef4444',
                              fontWeight: '700',
                              fontSize: '16px',
                              fontFamily: 'monospace',
                            }}>
                              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                            </div>

                            <div style={{ width: '1px', height: '28px', backgroundColor: '#1a2420' }} />

                            {/* TP / SL / R:R */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                              <span style={{ color: '#22c55e', fontWeight: '500' }}>TP {distToTp > 0 ? '+' : ''}{distToTp.toFixed(1)}%</span>
                              <span style={{ color: '#6b7c74' }}>|</span>
                              <span style={{ color: '#ef4444', fontWeight: '500' }}>SL -{distToSl.toFixed(1)}%</span>
                              <span style={{
                                fontSize: '12px',
                                color: '#a0a0a0',
                                backgroundColor: '#1a1a2e',
                                padding: '3px 10px',
                                borderRadius: '4px',
                                fontWeight: '600',
                                fontFamily: 'monospace',
                              }}>R:R 1:{rr}</span>
                            </div>
                          </div>

                          {/* Right Side - See more */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                            <span style={{ fontSize: '13px', color: '#6b7c74' }}>{isExpanded ? 'collapse' : '\u2192 see more details'}</span>
                            <span style={{ color: '#6b7c74', fontSize: '16px' }}>{isExpanded ? '\u2227' : '\u2228'}</span>
                          </div>
                        </div>

                        {/* Expanded: Decisions for this coin */}
                        {isExpanded && (
                          <div style={{
                            padding: '0 20px 20px',
                            backgroundColor: '#141a17',
                          }}>
                            {/* Position Details Header */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px 0',
                              borderBottom: '1px solid #1a2420',
                              marginBottom: '12px',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '12px', color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Position Details</span>
                                <span style={{ fontSize: '11px', color: '#6b7c74' }}>
                                  SL: <span style={{ color: '#ef4444' }}>${primary.sl.toLocaleString()}</span>
                                  {' / '}
                                  TP: <span style={{ color: '#22c55e' }}>${primary.tp.toLocaleString()}</span>
                                  {' / '}
                                  Holding: {primary.holding}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleForceLiquidation(primary.id) }}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: 'transparent',
                                  border: '1px solid #ef4444',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                }}>Force Liquidation</button>
                            </div>

                            {/* Latest Decision for this Position */}
                            <div style={{ fontSize: '12px', color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600', marginBottom: '12px' }}>
                              Latest Decision
                            </div>

                            {latestDecision ? (
                              <DecisionCard
                                decision={latestDecision}
                                isExpanded={expandedLivePosDecision === latestDecision.id}
                                onToggle={() => setExpandedLivePosDecision(expandedLivePosDecision === latestDecision.id ? null : latestDecision.id)}
                                onAskAssistant={handleAskAssistant}
                              />
                            ) : (
                              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7c74', fontSize: '13px' }}>
                                No decisions recorded for {coin} yet
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {filteredCoins.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#6b7c74', fontSize: '13px' }}>
                      No positions found for the selected filter
                    </div>
                  )}
                </div>
              </div>
              )
            })()}

 {/* Open Orders Sub-tab */}
  {liveSubTab === 'orders' && (() => {
  const openOrders = [
  { id: 1, symbol: 'BTC', type: 'TP', price: 69500, currentPrice: 67600, distance: '+2.8%', status: 'Active', linkedPosition: 'BTC-Long-#1024', createdBy: 'PM Agent', source: 'Exchange', tif: 'GTC', createdAt: '12:32:11 UTC', size: '0.15 BTC' },
  { id: 2, symbol: 'BTC', type: 'SL', price: 65800, currentPrice: 67600, distance: '-2.6%', status: 'Active', linkedPosition: 'BTC-Long-#1024', createdBy: 'Risk Manager', source: 'Exchange', tif: 'GTC', createdAt: '12:32:15 UTC', size: '0.15 BTC' },
  { id: 3, symbol: 'ETH', type: 'SL', price: 3350, currentPrice: 3486, distance: '-3.9%', status: 'Active', linkedPosition: 'ETH-Long-#1025', createdBy: 'Risk Manager', source: 'Exchange', tif: 'GTC', createdAt: '10:15:22 UTC', size: '2.5 ETH' },
  { id: 4, symbol: 'ETH', type: 'TP', price: 3650, currentPrice: 3486, distance: '+4.7%', status: 'Active', linkedPosition: 'ETH-Long-#1025', createdBy: 'PM Agent', source: 'Exchange', tif: 'GTC', createdAt: '10:15:25 UTC', size: '2.5 ETH' },
  { id: 5, symbol: 'SOL', type: 'TP', price: 210, currentPrice: 192, distance: '+9.4%', status: 'Active', linkedPosition: 'SOL-Long-#1026', createdBy: 'PM Agent', source: 'Exchange', tif: 'GTC', createdAt: '08:45:30 UTC', size: '50 SOL' },
  { id: 6, symbol: 'SOL', type: 'SL', price: 178, currentPrice: 192, distance: '-7.3%', status: 'Active', linkedPosition: 'SOL-Long-#1026', createdBy: 'Risk Manager', source: 'Exchange', tif: 'GTC', createdAt: '08:45:33 UTC', size: '50 SOL' },
  ]
  const filteredOrders = orderFilter === 'All' ? openOrders : openOrders.filter(o => o.symbol === orderFilter)
  const uniqueSymbols = [...new Set(openOrders.map(o => o.symbol))]
  
  return (
  <div style={{
  backgroundColor: '#0d1210',
  borderRadius: '12px',
  border: '1px solid #1a2420',
  overflow: 'hidden',
  }}>
  {/* Header with Filter */}
  <div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  borderBottom: '1px solid #1a2420',
  }}>
  <div style={{ fontWeight: '600', fontSize: '15px' }}>Open Orders ({filteredOrders.length})</div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
  {['All', ...uniqueSymbols].map(sym => (
  <button
  key={sym}
  onClick={() => setOrderFilter(sym)}
  style={{
  padding: '4px 12px',
  borderRadius: '4px',
  backgroundColor: orderFilter === sym ? '#1a2420' : 'transparent',
  border: orderFilter === sym ? '1px solid #2d3d36' : '1px solid transparent',
  color: orderFilter === sym ? '#e8e8e8' : '#6b7c74',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: orderFilter === sym ? '500' : '400',
  }}
  >{sym}</button>
  ))}
  </div>
  </div>

  {/* Table Header */}
  <div style={{
  display: 'grid',
  gridTemplateColumns: '80px 60px 1fr 100px 100px',
  padding: '10px 20px',
  borderBottom: '1px solid #1a2420',
  fontSize: '11px',
  color: '#6b7c74',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  }}>
  <span>Symbol</span>
  <span>Type</span>
  <span>Price</span>
  <span>Distance</span>
  <span>Status</span>
  </div>

  {/* Table Rows */}
  {filteredOrders.map(order => (
  <div key={order.id}>
  <div
  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
  style={{
  display: 'grid',
  gridTemplateColumns: '80px 60px 1fr 100px 100px',
  padding: '14px 20px',
  borderBottom: '1px solid #1a2420',
  cursor: 'pointer',
  backgroundColor: expandedOrder === order.id ? '#141a17' : 'transparent',
  transition: 'background-color 0.15s',
  alignItems: 'center',
  fontSize: '13px',
  }}
  >
  <span style={{ fontWeight: '600', color: '#e8e8e8' }}>{order.symbol}</span>
  <span style={{
  display: 'inline-flex',
  padding: '3px 8px',
  borderRadius: '4px',
  backgroundColor: order.type === 'TP' ? '#0d2818' : '#2d1f1f',
  color: order.type === 'TP' ? '#22c55e' : '#ef4444',
  fontSize: '11px',
  fontWeight: '600',
  width: 'fit-content',
  }}>{order.type}</span>
  <span style={{ color: '#e8e8e8', fontFamily: 'monospace' }}>${order.price.toLocaleString()}</span>
  <span style={{
  color: order.distance.startsWith('+') ? '#22c55e' : '#ef4444',
  fontFamily: 'monospace',
  fontWeight: '500',
  }}>{order.distance}</span>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
  <span style={{ color: '#22c55e', fontSize: '12px' }}>{order.status}</span>
  </div>
  <span style={{ color: '#6b7c74', fontSize: '14px' }}>{expandedOrder === order.id ? '∧' : '∨'}</span>
  </div>
  </div>

  {/* Expanded Order Details */}
  {expandedOrder === order.id && (
  <div style={{
  padding: '16px 20px 16px 40px',
  backgroundColor: '#141a17',
  borderBottom: '1px solid #1a2420',
  }}>
  <div style={{ fontSize: '12px', color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '600' }}>
  Order Details
  </div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
  <div>
  <div style={{ color: '#6b7c74', fontSize: '11px', marginBottom: '4px' }}>Linked Position</div>
  <div style={{ color: '#e8e8e8', fontWeight: '500' }}>{order.linkedPosition}</div>
  </div>
  <div>
  <div style={{ color: '#6b7c74', fontSize: '11px', marginBottom: '4px' }}>Created By</div>
  <div style={{ color: '#e8e8e8', fontWeight: '500' }}>{order.createdBy}</div>
  </div>
  <div>
  <div style={{ color: '#6b7c74', fontSize: '11px', marginBottom: '4px' }}>Source</div>
  <div style={{ color: '#e8e8e8', fontWeight: '500' }}>{order.source}</div>
  </div>
  <div>
  <div style={{ color: '#6b7c74', fontSize: '11px', marginBottom: '4px' }}>Time-in-Force</div>
  <div style={{ color: '#e8e8e8', fontWeight: '500' }}>{order.tif}</div>
  </div>
  <div>
  <div style={{ color: '#6b7c74', fontSize: '11px', marginBottom: '4px' }}>Created At</div>
  <div style={{ color: '#e8e8e8', fontWeight: '500', fontFamily: 'monospace' }}>{order.createdAt}</div>
  </div>
  <div>
  <div style={{ color: '#6b7c74', fontSize: '11px', marginBottom: '4px' }}>Size</div>
  <div style={{ color: '#e8e8e8', fontWeight: '500' }}>{order.size}</div>
  </div>
  </div>
  </div>
  )}
  </div>
  ))}

  {filteredOrders.length === 0 && (
  <div style={{ textAlign: 'center', padding: '24px', color: '#6b7c74', fontSize: '13px' }}>
  No open orders for {orderFilter}
  </div>
  )}
  </div>
  )
  })()}

            {/* Current Run Sub-tab */}
            {liveSubTab === 'run' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* In Progress Status */}
                <div style={{
                  backgroundColor: '#0d1210',
                  borderRadius: '12px',
                  border: '1px solid #1a2420',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#2d2810',
                        color: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                      }}>
                        <span style={{ animation: 'spin 2s linear infinite', display: 'inline-block' }}>⟳</span>
                      </span>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#e8e8e8' }}>Round In Progress</div>
                        <div style={{ fontSize: '12px', color: '#6b7c74', marginTop: '2px' }}>Round #1510 · Started 45s ago</div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      backgroundColor: '#2d281033',
                      borderRadius: '20px',
                      border: '1px solid #f59e0b33',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                      <span style={{ fontSize: '12px', color: '#f59e0b' }}>In Progress</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7c74' }}>Pipeline Progress</span>
                      <span style={{ fontSize: '12px', color: '#f59e0b' }}>65%</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#1a2420', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '65%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '3px', transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#6b7c74' }}>
                      <span>Research Agents → Manager → Risk Check → Execution</span>
                      <span>~15s remaining</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1a2420' }}>
                    <button
                      onClick={() => setShowLiquidateAllModal(true)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: '1px solid #ef444466',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ef444415'; e.currentTarget.style.borderColor = '#ef4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#ef444466'; }}
                    >Liquidate All</button>
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        backgroundColor: isRunning ? '#ef4444' : '#22c55e',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        minWidth: '90px',
                        transition: 'background-color 0.15s',
                      }}
                    >{isRunning ? 'Stop' : 'Run'}</button>
                  </div>
                </div>

                {/* Research Agents - Live Status */}
                <div style={{
                  backgroundColor: '#0d1210',
                  borderRadius: '12px',
                  border: '1px solid #1a2420',
                  padding: '20px',
                }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#e8e8e8', marginBottom: '16px' }}>
                    Research Agents (3)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                      { name: 'Technical Analysis', status: 'Completed', signal: 'BULLISH', confidence: 78, description: 'RSI rising. MACD crossover forming. Breakout likely.', elapsed: '12s' },
                      { name: 'Whale Tracker', status: 'Completed', signal: 'BULLISH', confidence: 72, description: 'Large accumulation detected on major exchanges.', elapsed: '18s' },
                      { name: 'Sentiment Analysis', status: 'Running', signal: '...', confidence: 0, description: 'Analyzing social feeds and news sentiment...', elapsed: '8s' },
                    ].map((agent, i) => (
                      <div key={i} style={{
                        padding: '16px',
                        backgroundColor: '#141a17',
                        borderRadius: '8px',
                        border: `1px solid ${agent.status === 'Running' ? '#f59e0b33' : '#1a2420'}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              width: '8px', 
                              height: '8px', 
                              borderRadius: '50%', 
                              backgroundColor: agent.status === 'Running' ? '#f59e0b' : '#22c55e',
                            }} />
                            <span style={{ fontWeight: '500', fontSize: '14px', color: '#e8e8e8' }}>{agent.name}</span>
                          </div>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: agent.signal === 'BULLISH' ? '#0d2818' : agent.signal === '...' ? '#2d2810' : '#1a1a1a',
                            color: agent.signal === 'BULLISH' ? '#22c55e' : agent.signal === '...' ? '#f59e0b' : '#6b7c74',
                            fontSize: '11px',
                          }}>{agent.signal}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7c74', marginBottom: '10px', lineHeight: '1.4' }}>{agent.description}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#6b7c74' }}>Elapsed: {agent.elapsed}</span>
                          {agent.status === 'Running' ? (
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '4px',
                              backgroundColor: '#2d2810',
                              border: '1px solid #f59e0b33',
                              color: '#f59e0b',
                              fontSize: '11px',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}>
                              <span style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>⟳</span>
                              Running
                            </span>
                          ) : (
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '4px',
                              backgroundColor: '#0d2818',
                              border: '1px solid #22c55e33',
                              color: '#22c55e',
                              fontSize: '11px',
                              fontWeight: '500',
                            }}>
                              Completed · {agent.confidence}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision Process - Pending */}
                <div style={{
                  backgroundColor: '#0d1210',
                  borderRadius: '12px',
                  border: '1px solid #1a2420',
                  padding: '20px',
                }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#e8e8e8' }}>Manager Decision Process</div>
                  <div style={{ fontSize: '12px', color: '#6b7c74', marginBottom: '16px' }}>Waiting for all research agents to complete...</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Risk Manager', role: 'Pre-check', status: 'PENDING', description: 'Waiting for signals...' },
                      { name: 'Portfolio Manager', action: null, status: 'PENDING', description: 'Will propose action after risk pre-check.' },
                      { name: 'Risk Manager', role: 'Post-check', status: 'PENDING', description: 'Awaiting PM proposal.' },
                      { name: 'Trader', status: 'PENDING', description: 'Will execute if approved.' },
                    ].map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: 0.5 }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#1a1a1a',
                          color: '#6b7c74',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          flexShrink: 0,
                        }}>{i + 1}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#e8e8e8' }}>
                              {step.name}
                              {step.role && <span style={{ color: '#6b7c74', fontWeight: '400' }}> ({step.role})</span>}
                            </span>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600',
                              backgroundColor: '#1a1a1a',
                              color: '#6b7c74',
                            }}>PENDING</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7c74', lineHeight: '1.5' }}>{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            )}

{/* Chart - only shown on Current Positions tab */}
{liveSubTab === 'positions' && (
<CombinedChart
  activeChartTab={activeChartTab}
  setActiveChartTab={setActiveChartTab}
  selectedToken={selectedToken}
  setSelectedToken={setSelectedToken}
  availableTokens={availableTokens}
  timeRange={chartTimeRange}
  setTimeRange={setChartTimeRange}
  priceTimeframe={priceTimeframe}
  setPriceTimeframe={setPriceTimeframe}
  trades={chartTrades}
/>
)}
  

  
  </div>
  )}
  
  {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              {/* History Sub-tabs */}
              <div style={{
                display: 'flex',
                gap: '0',
                marginBottom: '24px',
                borderBottom: '1px solid #1a2420',
              }}>
                {[
                  { id: 'positions', label: 'Closed Positions', count: positionHistory.filter(p => !p.active).length },
                  { id: 'runs', label: 'Runs', count: runHistory.length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setHistorySubTab(tab.id); setSelectedPosition(null); setExpandedDecision(null); }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: historySubTab === tab.id ? '2px solid #22c55e' : '2px solid transparent',
                      color: historySubTab === tab.id ? '#e8e8e8' : '#6b7c74',
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginBottom: '-1px',
                    }}
                  >
                    {tab.label} <span style={{ color: '#22c55e', marginLeft: '4px' }}>{tab.count}</span>
                  </button>
                ))}
              </div>

              {/* Positions Sub-tab */}
              {historySubTab === 'positions' && (
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
                  {/* Position List */}
                  <div style={{
                    backgroundColor: '#0d1210',
                    borderRadius: '12px',
                    border: '1px solid #1a2420',
                    padding: '16px',
                    height: 'fit-content',
                  }}>
                    {/* Header with Token Filter and Show Trades toggle */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h3 style={{ margin: 0, fontSize: '13px', color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
  Position History
  </h3>
  </div>
                      
                      {/* Token Filter Dropdown */}
                      <div style={{ position: 'relative' }}>
                        <select
                          value={tokenFilter}
                          onChange={(e) => { setTokenFilter(e.target.value); setSelectedPosition(null); }}
                          style={{
                            width: '100%',
                            padding: '8px 32px 8px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#141a17',
                            border: '1px solid #2d3d36',
                            color: '#e8e8e8',
                            fontSize: '13px',
                            cursor: 'pointer',
                            appearance: 'none',
                            outline: 'none',
                          }}
                        >
                          <option value="All">All Tokens</option>
                          {Array.from(new Set(positionHistory.map(p => p.symbol))).map(symbol => (
                            <option key={symbol} value={symbol}>{symbol}</option>
                          ))}
                        </select>
                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7c74', fontSize: '10px', pointerEvents: 'none' }}>▼</span>
                      </div>
                    </div>

{/* Closed Positions Section */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Closed Positions</span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: '#1a1a1a',
                          color: '#6b7c74',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          {positionHistory.filter(p => !p.active && (tokenFilter === 'All' || p.symbol === tokenFilter)).length}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {positionHistory.filter(p => !p.active && (tokenFilter === 'All' || p.symbol === tokenFilter)).map(pos => (
                          <div
                            key={pos.id}
                            onClick={() => setSelectedPosition(selectedPosition === pos.id ? null : pos.id)}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '8px',
                              backgroundColor: selectedPosition === pos.id ? '#141a17' : '#0a0f0d',
                              border: `1px solid ${selectedPosition === pos.id ? '#22c55e' : 'transparent'}`,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            {/* Left: Badge + Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: pos.side === 'LONG' ? '#0d2818' : '#2d1f1f',
                                color: pos.side === 'LONG' ? '#22c55e' : '#ef4444',
                                fontSize: '10px',
                                fontWeight: '600',
                              }}>
                                {pos.side}
                              </span>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '14px', color: '#e8e8e8' }}>{pos.symbol}</div>
                                <div style={{ fontSize: '12px', color: '#6b7c74', marginTop: '2px' }}>
                                  {pos.size} · {pos.date}
                                  {pos.exitType === 'Liquidated' && (
                                    <span style={{ color: '#ef4444', marginLeft: '6px' }}>Liquidated</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Right: PnL */}
                            <div style={{ textAlign: 'right' }}>
                              <div style={{
                                color: pos.pnl >= 0 ? '#22c55e' : '#ef4444',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}>
                                {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                              </div>
                              <div style={{
                                color: pos.pnl >= 0 ? '#22c55e' : '#ef4444',
                                fontSize: '12px',
                                marginTop: '2px',
                              }}>
                                {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Position Detail / Decisions */}
                  <div style={{
                    backgroundColor: '#0d1210',
                    borderRadius: '12px',
                    border: '1px solid #1a2420',
                    padding: '16px',
                  }}>
{selectedPosition ? (
  <>
  {/* Position Lifecycle */}
  <div style={{
    backgroundColor: '#141a17',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid #1a2420',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <span style={{ fontSize: '13px', color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Position Lifecycle
      </span>
    </div>
    
{/* Timeline */}
  <div style={{ position: 'relative', paddingLeft: '32px' }}>
  {/* Vertical Line */}
  <div style={{
  position: 'absolute',
  left: '5px',
  top: '12px',
  bottom: '12px',
  width: '2px',
  backgroundColor: '#2d3d36',
  }} />
      
      {/* Timeline Events */}
      {(() => {
        const positionDecisions = decisions.filter(d => d.positionId === selectedPosition)
        const openDecision = positionDecisions.find(d => d.type.includes('OPEN'))
        const closeDecision = positionDecisions.find(d => d.type.includes('CLOSE') || d.type.includes('LIQUIDAT'))
        const addDecisions = positionDecisions.filter(d => d.type.includes('ADD') || d.type.includes('INCREASE'))
        const reduceDecisions = positionDecisions.filter(d => d.type.includes('REDUCE') || d.type.includes('PARTIAL'))
        const holdDecisions = positionDecisions.filter(d => d.type === 'HOLD')
        const position = positionHistory.find(p => p.id === selectedPosition)
        
const events: Array<{
  time: string;
  roundId: string;
  action: string;
  detail: string;
  color: string;
  isUser: boolean;
  tp?: string;
  sl?: string;
  rr?: string;
  sizeChange?: string;
  newSize?: string;
  pnlChange?: number;
  price?: string;
  icon?: string;
  sortOrder?: number;
  }> = []
        
        // Open event with TP/SL/RR
        if (openDecision) {
          const entryPrice = position?.entry ? (typeof position.entry === 'string' ? parseFloat(position.entry.replace(/[$,]/g, '')) : position.entry) : 0
          const tpPrice = entryPrice * 1.03 // Example: 3% TP
          const slPrice = entryPrice * 0.98 // Example: 2% SL
          const risk = entryPrice - slPrice
          const reward = tpPrice - entryPrice
          const rrRatio = risk > 0 ? (reward / risk).toFixed(2) : '0'
          
events.push({
  time: openDecision.time,
  roundId: `Round #${1500 + openDecision.id}`,
  action: openDecision.type.includes('SHORT') ? 'OPEN SHORT' : 'OPEN LONG',
  detail: openDecision.detail,
  color: '#3b82f6',
  isUser: false,
  tp: `$${tpPrice.toFixed(2)}`,
  sl: `$${slPrice.toFixed(2)}`,
  rr: `1:${rrRatio}`,
  sizeChange: `+${position?.size || '0.05 BTC'}`,
  newSize: position?.size || '0.05 BTC',
  price: `$${entryPrice.toLocaleString()}`,
  icon: openDecision.type.includes('SHORT') ? '↘' : '↗',
  sortOrder: 0,
  })
        }
        
// Add position events
  addDecisions.forEach((addDec, idx) => {
  const addSize = addDec.detail?.match(/(\d+\.?\d*)\s*(BTC|ETH|SOL)/i)?.[0] || '0.02 BTC'
  events.push({
  time: addDec.time,
  roundId: `Round #${1500 + addDec.id}`,
  action: 'ADD',
  detail: addDec.detail || 'Increased position size',
  color: '#22c55e',
  isUser: false,
  sizeChange: `+${addSize}`,
  newSize: `0.${7 + idx} BTC`,
  price: addDec.detail?.match(/\$[\d,]+\.?\d*/)?.[0] || '$93,800',
  pnlChange: addDec.pnl || null,
  icon: '+',
  sortOrder: 1 + idx * 0.1,
  })
  })
        
// Reduce position events
  reduceDecisions.forEach((reduceDec, idx) => {
  const reduceSize = reduceDec.detail?.match(/(\d+\.?\d*)\s*(BTC|ETH|SOL)/i)?.[0] || '0.02 BTC'
  events.push({
  time: reduceDec.time,
  roundId: `Round #${1500 + reduceDec.id}`,
  action: 'REDUCE',
  detail: reduceDec.detail || 'Reduced position size',
  color: '#f59e0b',
  isUser: false,
  sizeChange: `-${reduceSize}`,
  newSize: `0.${5 - idx} BTC`,
  price: reduceDec.detail?.match(/\$[\d,]+\.?\d*/)?.[0] || '$94,100',
  pnlChange: reduceDec.pnl || 32.50,
  icon: '−',
  sortOrder: 2 + idx * 0.1,
  })
  })
        
// Hold events
  holdDecisions.forEach((holdDec, idx) => {
  events.push({
  time: holdDec.time,
  roundId: `Round #${1500 + holdDec.id}`,
  action: 'HOLD',
  detail: holdDec.detail || 'No action - waiting for signal',
  color: '#6b7c74',
  isUser: false,
  sizeChange: '—',
  newSize: position?.size || '0.05 BTC',
  icon: '⏸',
  sortOrder: 3 + idx * 0.1,
  })
  })
  
// Close event
  if (closeDecision) {
  const isUserClose = closeDecision.detail?.includes('User') || closeDecision.detail?.includes('Manual')
  events.push({
  time: closeDecision.time,
  roundId: isUserClose ? 'User' : `Round #${1500 + closeDecision.id}`,
  action: closeDecision.type.includes('LIQUIDAT') ? 'LIQUIDATED' : 'CLOSE',
  detail: closeDecision.detail || `Market close @ ${position?.exit || 'N/A'}`,
  color: closeDecision.type.includes('LIQUIDAT') || closeDecision.detail?.includes('SL') ? '#ef4444' : '#3b82f6',
  isUser: isUserClose,
  icon: '✕',
  sortOrder: 100,
  sizeChange: `-${position?.size || '0.05 BTC'}`,
  newSize: '0',
  price: position?.exit ? `$${position.exit}` : undefined,
  pnlChange: position?.pnl,
  })
  }
  
  // Sort by sortOrder (chronological)
  events.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        
        return events.map((event, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '12px',
            marginBottom: i < events.length - 1 ? '20px' : '0',
            position: 'relative',
          }}>
            {/* Dot with Icon */}
            <div style={{
              position: 'absolute',
              left: '-24px',
              top: '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: event.color + '30',
              border: `2px solid ${event.color}`,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: event.color,
              fontWeight: '600',
            }}>
              {event.icon || '•'}
            </div>
            
            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#6b7c74', fontFamily: 'monospace' }}>{event.time}</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: event.isUser ? '#2d1f1f' : '#1a1a2e',
                  color: event.isUser ? '#ef4444' : '#6b7c74',
                  fontSize: '11px',
                }}>{event.roundId}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#e8e8e8' }}>
                <span style={{ fontWeight: '500' }}>{event.action}</span>
                <span style={{ color: '#6b7c74' }}> · {event.detail}</span>
              </div>
              {/* Size and Value Changes */}
              {event.sizeChange && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: '12px', 
                  marginTop: '8px', 
                  fontSize: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#0d1210',
                  borderRadius: '6px',
                  border: '1px solid #1a2420',
                }}>
                  {/* Size Change */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#6b7c74' }}>Size:</span>
                    <span style={{ 
                      color: event.sizeChange.startsWith('+') ? '#22c55e' : event.sizeChange.startsWith('-') ? '#ef4444' : '#6b7c74',
                      fontWeight: '500',
                    }}>{event.sizeChange}</span>
                    <span style={{ color: '#6b7c74' }}>→</span>
                    <span style={{ color: '#e8e8e8', fontWeight: '500' }}>{event.newSize}</span>
                  </div>
                  {/* Price */}
                  {event.price && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#6b7c74' }}>@ Price:</span>
                      <span style={{ color: '#e8e8e8', fontWeight: '500' }}>{event.price}</span>
                    </div>
                  )}
                  {/* Realized PnL */}
                  {event.pnlChange !== undefined && event.pnlChange !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#6b7c74' }}>Realized:</span>
                      <span style={{ 
                        color: event.pnlChange >= 0 ? '#22c55e' : '#ef4444',
                        fontWeight: '500',
                      }}>{event.pnlChange >= 0 ? '+' : ''}${event.pnlChange.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
              {/* Show TP/SL/RR for open events */}
              {event.tp && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px' }}>
                  <span style={{ color: '#22c55e' }}>TP: {event.tp}</span>
                  <span style={{ color: '#ef4444' }}>SL: {event.sl}</span>
                  <span style={{ color: '#6b7c74' }}>R:R {event.rr}</span>
                </div>
              )}
            </div>
          </div>
        ))
      })()}
    </div>
  </div>
  
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Position #{selectedPosition} · Decisions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {decisions
                        .filter(d => d.positionId === selectedPosition)
                        .map(decision => (
                          <DecisionCard
                            key={decision.id}
                            decision={decision}
                            isExpanded={expandedDecision === decision.id}
onToggle={() => setExpandedDecision(expandedDecision === decision.id ? null : decision.id)}
/>
                        ))}
                    </div>
                  </>
                ) : (
  <div style={{ color: '#6b7c74', fontSize: '14px', padding: '40px', textAlign: 'center' }}>
                        ← Select a position to view its decisions
                      </div>
                    )}
                  </div>
                </div>
              )}

{/* Runs Sub-tab */}
              {historySubTab === 'runs' && (
                <div style={{
                  backgroundColor: '#0d1210',
                  borderRadius: '12px',
                  border: '1px solid #1a2420',
                  padding: '16px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}>
                    <h3 style={{ margin: 0, fontSize: '13px', color: '#6b7c74', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Run History
                    </h3>
                    <span style={{ fontSize: '12px', color: '#6b7c74' }}>Page 1 of 7</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {runHistory.map(run => (
                      <div key={run.id} style={{
                        backgroundColor: '#141a17',
                        borderRadius: '8px',
                        border: expandedRun === run.id ? '1px solid #22c55e33' : '1px solid transparent',
                        overflow: 'hidden',
                      }}>
                        {/* Run Row */}
                        <div 
                          onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '90px 140px 1fr 70px 60px 24px',
                            alignItems: 'center',
                            padding: '12px 14px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: run.status === 'succeeded' ? '#22c55e' : '#ef4444',
                            }} />
                            <span style={{ color: run.status === 'succeeded' ? '#22c55e' : '#ef4444' }}>{run.status}</span>
                          </div>
<div style={{ color: '#6b7c74', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>ID: {run.id}...</div>
  <div style={{ color: '#6b7c74' }}>{run.time}</div>
  <div style={{ color: '#22c55e' }}>{run.symbol}</div>
  <div style={{ color: '#6b7c74' }}>{run.duration}</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <button
  onClick={(e) => { e.stopPropagation(); handleAskAssistant(`Explain run ID ${run.id}: ${run.status} on ${run.symbol}, decision: ${run.decision}, duration: ${run.duration}`); }}
  style={{
  padding: '3px 8px',
  borderRadius: '4px',
  backgroundColor: '#0d2818',
  border: 'none',
  color: '#22c55e',
  cursor: 'pointer',
  fontSize: '10px',
  }}
  >Ask AI</button>
  <span style={{ color: '#6b7c74', fontSize: '14px' }}>{expandedRun === run.id ? '∧' : '∨'}</span>
  </div>
  {expandedRun !== run.id && (
  <span style={{ fontSize: '11px', color: '#6b7c74', gridColumn: '1 / -1', textAlign: 'right', marginTop: '4px' }}>
  → See Decision
  </span>
  )}
  </div>
                        
                        {/* Expanded Content */}
                        {expandedRun === run.id && (
                          <div style={{
                            padding: '16px',
                            borderTop: '1px solid #1a2420',
                            backgroundColor: '#0d1210',
                          }}>
{/* Decision Details - Full DecisionCard if available */}
                            {run.decisionData && (
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '11px', color: '#6b7c74', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Decision Details</div>
                                <DecisionCard
                                  decision={{
                                    id: run.id,
                                    type: run.decisionData.type,
                                    detail: run.decisionData.detail,
                                    time: run.time,
                                    prompt: `Prompt ${run.prompt}`,
                                    positionId: run.decisionData.positionId,
                                    pnl: run.decisionData.pnl,
                                    orders: run.decisionData.orders,
                                    researchAgents: run.decisionData.researchAgents,
                                    managerProcess: run.decisionData.managerProcess,
                                    pipeline: run.decisionData.pipeline,
                                  }}
isExpanded={expandedRunDetail === `${run.id}-decision`}
onToggle={() => setExpandedRunDetail(expandedRunDetail === `${run.id}-decision` ? null : `${run.id}-decision`)}
/>
                              </div>
                            )}

                            {/* Run Details - Clickable Cards */}
                            {!run.decisionData && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                {/* Simple Decision Card - Only show if no decisionData */}
                                <div 
                                  onClick={() => setExpandedRunDetail(expandedRunDetail === `${run.id}-decision` ? null : `${run.id}-decision`)}
                                  style={{
                                    padding: '12px',
                                    backgroundColor: '#141a17',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    border: expandedRunDetail === `${run.id}-decision` ? '1px solid #22c55e33' : '1px solid transparent',
                                    transition: 'border-color 0.2s',
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '11px', color: '#6b7c74' }}>DECISION</span>
                                    <span style={{ fontSize: '12px', color: '#6b7c74' }}>{expandedRunDetail === `${run.id}-decision` ? '∧' : '∨'}</span>
                                  </div>
                                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                                    <span style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      gap: '4px',
                                      padding: '3px 8px',
                                      borderRadius: '4px',
                                      backgroundColor: run.decision?.includes('LONG') ? '#0d2818' : run.decision?.includes('SHORT') ? '#2d1f1f' : '#1a1a1a',
                                      color: run.decision?.includes('LONG') ? '#22c55e' : run.decision?.includes('SHORT') ? '#ef4444' : '#6b7c74',
                                    }}>
                                      <span style={{ fontSize: '10px' }}>
                                        {run.decision?.includes('LONG') ? '↗' : run.decision?.includes('SHORT') ? '↘' : '▪'}
                                      </span>
                                      {run.decision || 'HOLD'}
                                    </span>
                                  </div>
                                  {expandedRunDetail === `${run.id}-decision` && (
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1a2420', fontSize: '12px', color: '#6b7c74', lineHeight: '1.6' }}>
                                      <div><strong style={{ color: '#e8e8e8' }}>Status:</strong> {run.status === 'failed' ? 'Run failed - no decision data available' : 'No detailed decision data'}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ═══════════ TOP KPIs ═══════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {/* Total PnL */}
              <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '12px' }}>Total PnL</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: '700', color: '#00d4aa' }}>+$1,245.80</div>
                <div style={{ fontSize: '13px', color: '#5a5a65', marginTop: '4px' }}>Across 21 positions</div>
              </div>
              {/* Win Rate */}
              <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '12px' }}>Win Rate</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: '700', color: '#e8e8ed' }}>
                  65<span style={{ fontSize: '16px', color: '#5a5a65' }}>%</span>
                  <span style={{ fontSize: '14px', color: '#8a8a95', marginLeft: '8px', fontWeight: '400' }}>13W / 7L</span>
                </div>
                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginTop: '12px', gap: '2px' }}>
                  <div style={{ background: '#00d4aa', flex: 13, borderRadius: '4px' }} />
                  <div style={{ background: '#ff4d6a', flex: 7, borderRadius: '4px' }} />
                </div>
              </div>
              {/* Net ROI */}
              <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '12px' }}>Net ROI</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: '700', color: '#00d4aa' }}>+12.5%</div>
                <div style={{ fontSize: '13px', color: '#5a5a65', marginTop: '4px' }}>Since inception</div>
              </div>
            </div>

            {/* ═══════════ ROW 2: Avg Win/Loss · Trades Breakdown · Volume ═══════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {/* Avg Win/Loss */}
              <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '12px' }}>Avg Win / Loss</div>
                <div style={{ display: 'flex', gap: '24px', marginTop: '4px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#5a5a65' }}>Avg Win</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', fontWeight: '700', color: '#00d4aa' }}>+$156</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#5a5a65' }}>Avg Loss</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', fontWeight: '700', color: '#ff4d6a' }}>{'\u2212'}$65</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                  <span style={{ fontSize: '12px', color: '#5a5a65' }}>Profit Factor</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '6px', background: '#1a1a24', border: '1px solid #18181f', color: '#e8e8ed' }}>2.4:1</span>
                </div>
              </div>
              {/* Trades Breakdown */}
              <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '12px' }}>Trades Breakdown</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: '700', color: '#e8e8ed' }}>47</div>
                <div style={{ fontSize: '13px', color: '#5a5a65', marginTop: '4px' }}>Total trades across 21 positions</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '12px', color: '#8a8a95' }}>
                  <span><span style={{ width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '6px', background: '#00d4aa' }} />Open: 12</span>
                  <span><span style={{ width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '6px', background: '#f5a623' }} />Add: 18</span>
                  <span><span style={{ width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '6px', background: '#ff4d6a' }} />Close: 17</span>
                </div>
              </div>
              {/* Total Volume */}
              <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '12px' }}>Total Volume</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: '700', color: '#e8e8ed' }}>$68,420</div>
                <div style={{ fontSize: '13px', color: '#5a5a65', marginTop: '4px' }}>Cumulative traded volume</div>
                <div style={{ display: 'flex', gap: '24px', marginTop: '10px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#5a5a65' }}>Buy Volume</span>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '600', color: '#00d4aa' }}>$38,200</div>
                  </div>
                  <div>
                    <span style={{ color: '#5a5a65' }}>Sell Volume</span>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '600', color: '#ff4d6a' }}>$30,220</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════ ACCOUNT OVERVIEW ═══════════ */}
            <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Account Overview
                <span style={{ flex: 1, height: '1px', background: '#18181f' }} />
              </div>
              {[
                { label: 'Equity', value: '$1,616.19', indicator: false },
                { label: 'Available', value: '$1,616.19', indicator: false },
                { label: 'Total PnL', value: '$644.6677', indicator: true, dotColor: '#00d4aa', valueColor: '#00d4aa' },
                { label: 'Total Fees', value: '$27.7308', indicator: true, dotColor: '#f5a623', valueColor: '#e8e8ed' },
                { label: 'Net Realized PnL', value: '$644.6677', indicator: true, dotColor: '#00d4aa', valueColor: '#00d4aa' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #18181f', fontSize: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {row.indicator && <span style={{ width: '3px', height: '20px', borderRadius: '2px', background: row.dotColor }} />}
                    <span style={{ color: '#8a8a95' }}>{row.label}</span>
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '600', color: row.valueColor || '#e8e8ed' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* ═══════════ TRADING STATS + TIME DISTRIBUTION ═══════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {/* Trading Stats */}
              <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Trading Stats
                  <span style={{ flex: 1, height: '1px', background: '#18181f' }} />
                </div>
                {[
                  { label: 'Avg. Leverage', value: '20x', color: '#e8e8ed' },
                  { label: 'Biggest Win', value: '+$198.2146', color: '#00d4aa' },
                  { label: 'Biggest Loss', value: '\u2212$116.6360', color: '#ff4d6a' },
                ].map((stat, i) => (
                  <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 2 ? '1px solid #18181f' : 'none', fontSize: '14px' }}>
                    <span style={{ color: '#8a8a95' }}>{stat.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '600', color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Time Distribution */}
              <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Time Distribution
                  <span style={{ flex: 1, height: '1px', background: '#18181f' }} />
                </div>
                {[
                  { label: 'Long Time', pct: '49.97%', width: '49.97%', color: '#00d4aa' },
                  { label: 'Short Time', pct: '49.97%', width: '49.97%', color: '#ff4d6a' },
                  { label: 'Flat Time', pct: '0.06%', width: '0.06%', color: '#555', muted: true },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
                    <span style={{ fontSize: '13px', color: '#8a8a95', width: '80px', flexShrink: 0 }}>{item.label}</span>
                    <div style={{ flex: 1, height: '6px', background: '#111118', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: item.width, background: item.color, borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: '600', width: '60px', textAlign: 'right', flexShrink: 0, color: item.muted ? '#5a5a65' : '#e8e8ed' }}>{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════════ OPEN POSITIONS ═══════════ */}
            <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Open Positions
                <span style={{ flex: 1, height: '1px', background: '#18181f' }} />
              </div>
              <div style={{ fontSize: '14px', color: '#5a5a65' }}>
                Total UPnL <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '600', color: '#e8e8ed', marginLeft: '8px' }}>$0.0000</span>
              </div>
            </div>

            {/* ═══════════ DECISION ANALYTICS ═══════════ */}
            <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Decision Analytics
                <span style={{ flex: 1, height: '1px', background: '#18181f' }} />
              </div>

              {/* 3 clickable stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Decisions Executed', value: '47' },
                  { label: 'High Consensus Trades', value: '29' },
                  { label: 'Blocked by Risk Manager', value: '11', isRed: true },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    onClick={() => setActiveTab('decisions')}
                    style={{
                      background: '#07070a',
                      border: '1px solid #22222a',
                      borderRadius: '10px',
                      padding: '18px',
                      cursor: 'pointer',
                      transition: 'border-color 0.25s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#00d4aa')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#22222a')}
                  >
                    <div style={{ fontSize: '12px', color: '#5a5a65' }}>{stat.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', fontWeight: '700', color: stat.isRed ? '#ff4d6a' : '#e8e8ed', marginTop: '6px' }}>{stat.value}</div>
                  </div>
                ))}
              </div>


            </div>

            {/* ═══════════ RESEARCH EFFECTIVENESS ═══════════ */}
            <div style={{ background: '#0a0a0e', border: '1px solid #18181f', borderRadius: '14px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a65', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Research Effectiveness
                <span style={{ flex: 1, height: '1px', background: '#18181f' }} />
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#5a5a65', padding: '0 0 14px 0' }}>Agent</th>
                    <th style={{ textAlign: 'left', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#5a5a65', padding: '0 0 14px 0' }}>Win Rate</th>
                    <th style={{ textAlign: 'left', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#5a5a65', padding: '0 0 14px 0' }}>Avg Confidence</th>
                    <th style={{ textAlign: 'right', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#5a5a65', padding: '0 0 14px 0' }}>PnL Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Technical', icon: 'T', iconBg: '#00d4aa18', iconColor: '#00d4aa', winRate: 70, avgConf: '0.82', pnl: '+$420.00' },
                    { name: 'Sentiment', icon: 'S', iconBg: '#a78bfa18', iconColor: '#a78bfa', winRate: 63, avgConf: '0.74', pnl: '+$310.00' },
                    { name: 'Whale', icon: 'W', iconBg: '#38bdf818', iconColor: '#38bdf8', winRate: 65, avgConf: '0.79', pnl: '+$515.80' },
                  ].map((agent) => (
                    <tr key={agent.name}>
                      <td style={{ padding: '14px 0', borderTop: '1px solid #18181f', color: '#8a8a95' }}>
                        <div style={{ color: '#e8e8ed', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', background: agent.iconBg, color: agent.iconColor }}>{agent.icon}</div>
                          {agent.name}
                        </div>
                      </td>
                      <td style={{ padding: '14px 0', borderTop: '1px solid #18181f', color: '#8a8a95' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '600', color: '#e8e8ed' }}>{agent.winRate}%</span>
                        <div style={{ width: '80px', height: '6px', background: '#07070a', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
                          <div style={{ height: '100%', width: `${agent.winRate}%`, background: '#00d4aa', borderRadius: '3px' }} />
                        </div>
                      </td>
                      <td style={{ padding: '14px 0', borderTop: '1px solid #18181f', fontFamily: "'JetBrains Mono', monospace", color: '#8a8a95' }}>{agent.avgConf}</td>
                      <td style={{ padding: '14px 0', borderTop: '1px solid #18181f', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: '600', color: '#00d4aa' }}>{agent.pnl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        </div>
      </div>
    )
  }
