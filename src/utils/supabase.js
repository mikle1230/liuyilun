import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. MICE data will not be available.')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')

export async function getMICEDestinationsByCountry(countryName) {
  // Map country names to EuMICE regions
  const regionMap = {
    '瑞士': ['阿尔卑斯地区'],
    '奥地利': ['阿尔卑斯地区'],
    '法国': ['法国'],
    '德国': ['德语区'],
    '意大利': ['地中海沿岸'],
    '西班牙': ['伊比利亚半岛'],
    '葡萄牙': ['伊比利亚半岛'],
    '英国': ['英伦三岛'],
    '爱尔兰': ['英伦三岛'],
    '挪威': ['北欧'],
    '瑞典': ['北欧'],
    '芬兰': ['北欧'],
    '丹麦': ['北欧'],
    '冰岛': ['北欧'],
    '希腊': ['地中海沿岸'],
    '克罗地亚': ['地中海沿岸'],
    '捷克': ['东欧'],
    '匈牙利': ['东欧'],
    '波兰': ['东欧'],
    '荷兰': ['低地国家（荷比卢）'],
    '比利时': ['低地国家（荷比卢）'],
    '卢森堡': ['低地国家（荷比卢）'],
  }

  const regions = regionMap[countryName]
  if (!regions) return []

  const { data, error } = await supabase
    .from('destinations')
    .select('id, name, region, tier, pitch, season, themes, completeness, group_size, venues, activities, china_notes, direct_flight, visa_info, dining, event_type')
    .in('region', regions)
    .order('completeness', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Failed to fetch MICE destinations:', error)
    return []
  }

  return data || []
}
