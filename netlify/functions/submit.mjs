const APP_ID = 'cli_a934ac6034b8dcb3';
const APP_SECRET = '4ZylwBs4PjlAlS0bpVwHnf5FqQmRvlEF';
const APP_TOKEN = 'Ja8jbqkmVamaUjsvl8Ec1BVCn3g';
const TABLE_ID = 'tblftbE5Tv8GAewe';

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();

    const tokenRes = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
      }
    );
    const tokenData = await tokenRes.json();

    const recordRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.tenant_access_token}`,
        },
        body: JSON.stringify({ fields: body }),
      }
    );
    const recordData = await recordRes.json();

    return new Response(JSON.stringify(recordData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const config = {
  path: '/api/submit',
};
