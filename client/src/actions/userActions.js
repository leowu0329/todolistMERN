export async function register(formData) {
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || '注册失败');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || '注册失败，请稍后重试');
  }
}

export async function login(formData) {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || '登录失败');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || '登录失败，请稍后重试');
  }
}
