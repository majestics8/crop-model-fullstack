'use client'
import { useState, useRef } from 'react'

// Enhanced color palette with gradients and professional tones
const COLORS = {
  primary: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
  },
  secondary: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00'
  },
  status: {
    healthy: '#4CAF50',
    disease: '#F44336',
    warning: '#FF9800'
  },
  background: {
    main: '#f8fdf8',
    card: '#ffffff',
    hover: '#f5f5f5'
  },
  text: {
    primary: '#2E3A47',
    secondary: '#6B7280',
    light: '#9E9E9E'
  }
}

const SHADOWS = {
  small: '0 2px 8px rgba(0,0,0,0.08)',
  medium: '0 4px 20px rgba(0,0,0,0.12)',
  large: '0 8px 30px rgba(0,0,0,0.15)'
}

const BORDER_RADIUS = {
  small: '8px',
  medium: '12px',
  large: '16px'
}

export default function Home() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const getPredictionColor = (label) => {
    if (!label) return COLORS.text.primary
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('healthy')) return COLORS.status.healthy
    if (lowerLabel.includes('disease') || lowerLabel.includes('infected')) return COLORS.status.disease
    return COLORS.status.warning
  }

  const getStatusIcon = (label) => {
    if (!label) return '🌱'
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('healthy')) return '✅'
    if (lowerLabel.includes('disease') || lowerLabel.includes('infected')) return '⚠️'
    return '🔍'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return
    
    setLoading(true)
    setResult(null)

    const fd = new FormData()
    fd.append('file', file) 

    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: fd,
      })
      
      const data = await res.json()
      
      if (data.error) {
        setResult({ error: data.error })
      } else {
        setResult(data)
      }
      
    } catch (err) {
      console.error("Fetch Error:", err)
      setResult({ error: `Could not connect to backend server. Please ensure the Flask server is running on port 5000. Details: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      backgroundColor: COLORS.background.main, 
      minHeight: '100vh', 
      padding: '40px 20px', 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(120, 219, 126, 0.1) 0%, transparent 25%), radial-gradient(circle at 85% 30%, rgba(120, 219, 126, 0.05) 0%, transparent 25%)'
    }}>
      
      {/* Main Card Container */}
      <div style={{
        backgroundColor: COLORS.background.card,
        borderRadius: BORDER_RADIUS.large,
        boxShadow: SHADOWS.large,
        padding: '40px',
        maxWidth: '550px',
        width: '100%',
        transition: 'all 0.3s ease-in-out',
        border: `1px solid rgba(46, 125, 50, 0.1)`
      }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: COLORS.primary.gradient,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px'
          }}>
            🌿
          </div>
          <h1 style={{ 
            color: COLORS.text.primary,
            marginBottom: '8px',
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}>
            Crop Type Identifier
          </h1>
          <p style={{ 
            color: COLORS.text.secondary,
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Upload an image of your crop to identify its type and get detailed information
          </p>
        </div>

        {/* Upload Section */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
          <div 
            style={{
              border: `2px dashed ${dragActive ? COLORS.primary.main : COLORS.text.light}`,
              borderRadius: BORDER_RADIUS.medium,
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: dragActive ? 'rgba(76, 175, 80, 0.05)' : COLORS.background.card,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
            <p style={{ 
              color: COLORS.text.primary, 
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {file ? file.name : 'Drag & drop your crop image here'}
            </p>
            <p style={{ 
              color: COLORS.text.secondary,
              fontSize: '14px'
            }}>
              or click to browse files
            </p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleChange}
              style={{ display: 'none' }}
            />
          </div>

          {file && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: COLORS.background.hover,
              padding: '12px 16px',
              borderRadius: BORDER_RADIUS.small,
              marginBottom: '20px'
            }}>
              <span style={{ 
                color: COLORS.text.primary,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {file.name}
              </span>
              <button 
                type="button"
                onClick={() => setFile(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.text.light,
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !file}
            style={{
              width: '100%',
              padding: '16px',
              background: loading || !file ? COLORS.text.light : COLORS.primary.gradient,
              color: 'white',
              border: 'none',
              borderRadius: BORDER_RADIUS.medium,
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !file ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading || !file ? 'none' : SHADOWS.small,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (!loading && file) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = SHADOWS.medium
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && file) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = SHADOWS.small
              }
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
                  ⏳
                </span>
                Identifying Crop...
              </>
            ) : (
              'Identify Crop Type'
            )}
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div style={{ 
            marginTop: '24px',
            padding: '24px',
            borderRadius: BORDER_RADIUS.medium,
            border: `1px solid ${result.error ? COLORS.status.disease : getPredictionColor(result.prediction_label)}20`,
            backgroundColor: result.error ? '#FFEBEE10' : `${getPredictionColor(result.prediction_label)}10`,
            boxShadow: SHADOWS.small,
            animation: 'fadeIn 0.5s ease-in-out'
          }}>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ 
                fontSize: '24px',
                marginRight: '12px'
              }}>
                {result.error ? '❌' : getStatusIcon(result.prediction_label)}
              </span>
              <h3 style={{ 
                color: result.error ? COLORS.status.disease : getPredictionColor(result.prediction_label),
                margin: 0,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {result.error ? 'Identification Failed' : 'Identification Complete'}
              </h3>
            </div>

            {result.error ? (
              <div>
                <p style={{ 
                  color: COLORS.status.disease,
                  marginBottom: '12px',
                  lineHeight: '1.5'
                }}>
                  {result.error}
                </p>
                <div style={{
                  backgroundColor: '#FFEBEE',
                  padding: '12px',
                  borderRadius: BORDER_RADIUS.small,
                  borderLeft: `4px solid ${COLORS.status.disease}`
                }}>
                  <p style={{ 
                    color: COLORS.text.primary,
                    fontSize: '14px',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    Troubleshooting tips:
                  </p>
                  <ul style={{ 
                    color: COLORS.text.secondary,
                    fontSize: '13px',
                    margin: '8px 0 0 0',
                    paddingLeft: '20px'
                  }}>
                    <li>Ensure the Flask server is running on port 5000</li>
                    <li>Check your network connection</li>
                    <li>Verify the image format is supported</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: getPredictionColor(result.prediction_label)
                  }}>
                    {result.prediction_label}
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: COLORS.text.light,
                    backgroundColor: COLORS.background.hover,
                    padding: '4px 8px',
                    borderRadius: '20px'
                  }}>
                    Index: {result.prediction_index}
                  </span>
                </div>
                
                <p style={{ 
                  fontSize: '14px', 
                  color: COLORS.text.secondary,
                  margin: 0
                }}>
                  The AI model has identified your crop as shown above.
                </p>
              </div>
            )}

            {/* Advanced Details */}
            <details style={{ marginTop: '20px' }}>
              <summary style={{ 
                cursor: 'pointer', 
                color: COLORS.primary.main, 
                fontWeight: '600',
                fontSize: '14px',
                padding: '8px 0'
              }}>
                View Technical Details
              </summary>
              <div style={{ 
                backgroundColor: COLORS.background.hover,
                padding: '16px',
                borderRadius: BORDER_RADIUS.small,
                marginTop: '12px',
                fontSize: '12px',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}