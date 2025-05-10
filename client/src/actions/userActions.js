export async function register(previousState, formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');
    const res = await fetch('http://localhost:3000/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data?.error) {
      return { ...previousState, error: data.error };
    }
    return { error: null, success: data };
  } catch (error) {
    return { ...previousState, error: 'Something went wrong' };
  }
}
