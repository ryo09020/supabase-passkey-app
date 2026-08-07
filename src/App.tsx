import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    
    // ログイン状態の変化を自動検知して画面を切り替える
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => authListener.subscription.unsubscribe()
  }, [])

  // ① 新規登録（メール認証をスキップして即座にログイン状態になる）
  const handleSignUp = async () => {
    if (!email) {
      alert('メールアドレスを入力してください')
      return
    }
    setLoading(true)
    try {
      const dummyPassword = 'PasskeyDummyPassword123!'
      const { error } = await supabase.auth.signUp({
        email: email,
        password: dummyPassword,
      })
      if (error) throw error

      // Confirm emailがオフの場合、signUp成功直後に自動的にログイン状態になり、
      // useEffect内のonAuthStateChangeが検知してログイン後の画面に切り替わります。
    } catch (error: any) {
      alert('エラーが発生しました: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // ② ログイン後に任意のタイミングでパスキーを登録する
  const handleRegisterPasskey = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.registerPasskey()
      if (error) throw error
      alert('この端末にパスキーが登録されました！次回からパスキーだけでログインできます。')
    } catch (error: any) {
      alert('エラーが発生しました: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // ③ 登録済みのパスキーでログイン
  const handleLoginWithPasskey = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPasskey()
      if (error) throw error
    } catch (error: any) {
      alert('ログイン失敗: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>開発用 Passkey デモ</h1>
      
      {user ? (
        // ==========================================
        // ログイン後の画面
        // ==========================================
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <p>🎉 ログイン成功！<br />ID: {user.id}</p>
          
          <div style={{ padding: '20px', border: '2px solid #4CAF50', borderRadius: '8px', maxWidth: '350px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>端末の登録</h3>
            <p style={{ fontSize: '14px', marginBottom: '15px' }}>
              この端末の生体認証を登録しましょう。
            </p>
            <button onClick={handleRegisterPasskey} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              👆 この端末のパスキーを登録
            </button>
          </div>

          <button onClick={handleLogout} style={{ marginTop: '20px' }}>ログアウト</button>
        </div>
      ) : (
        // ==========================================
        // ログイン前の画面
        // ==========================================
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
          
          {/* 初回登録入力エリア */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>【新規登録】</p>
            <input 
              type="email" 
              placeholder="適当なメールアドレスを入力" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', fontSize: '16px' }}
            />
            <button onClick={handleSignUp} disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
              登録して即ログイン
            </button>
          </div>
          
          <div style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}></div>

          {/* パスキーログインエリア */}
          <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
             <p style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>【登録済みの方】</p>
            <button onClick={handleLoginWithPasskey} disabled={loading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
              🔑 パスキーでログイン
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default App