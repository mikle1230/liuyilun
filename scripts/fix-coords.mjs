/**
 * Fix city coordinates for newly added cities (those at default [48, 10]).
 * Uses a lookup of approximate coordinates.
 */
import fs from 'fs'

const travel = JSON.parse(fs.readFileSync('src/data/europe-travel.json', 'utf-8'))

const coordLookup = {
  // France
  '圣米歇尔山': [48.636, -1.511],
  '阿维尼翁': [43.949, 4.806],
  '卢瓦尔河谷': [47.4, 0.7],
  '科尔马': [48.081, 7.355],
  '里昂': [45.764, 4.836],
  // UK
  '索尔兹伯里': [51.069, -1.794],
  '湖区': [54.5, -3.0],
  '约克': [53.959, -1.082],
  '科茨沃尔德': [51.833, -1.833],
  '巴斯': [51.382, -2.359],
  // Germany
  '菲森': [47.571, 10.701],
  '科隆': [50.938, 6.960],
  '罗滕堡': [49.380, 10.188],
  '汉堡': [53.551, 9.994],
  '海德堡': [49.398, 8.672],
  // Netherlands
  '库肯霍夫': [52.270, 4.547],
  '羊角村': [52.739, 6.077],
  // Belgium
  '根特': [51.054, 3.725],
  // Switzerland
  '采尔马特': [46.021, 7.749],
  '伯尔尼': [46.948, 7.447],
  // Austria
  '哈尔施塔特': [47.560, 13.649],
  '因斯布鲁克': [47.268, 11.395],
  // Italy
  '梵蒂冈': [41.902, 12.453],
  '比萨': [43.723, 10.397],
  '托斯卡纳乡村': [43.5, 11.5],
  '阿玛尔菲海岸': [40.633, 14.600],
  '五渔村': [44.127, 9.709],
  '米兰': [45.464, 9.190],
  '多洛米蒂山': [46.5, 12.0],
  '西西里岛': [37.5, 14.0],
  // Spain
  '圣地亚哥-德孔波斯特拉': [42.878, -8.544],
  '托莱多': [39.857, -4.024],
  '科尔多瓦': [37.888, -4.779],
  '毕尔巴鄂': [43.263, -2.935],
  // Portugal
  '辛特拉': [38.793, -9.382],
  '阿尔加维': [37.0, -8.0],
  // Greece
  '米克诺斯岛': [37.447, 25.328],
  '迈泰奥拉': [39.714, 21.631],
  // Czech - already covered
  // Hungary - already covered
  // Croatia
  '斯普利特': [43.509, 16.440],
  '普利特维采湖': [44.88, 15.612],
  // Sweden - already has stockholm
  // Denmark - already has copenhagen
  // Norway - already has bergen
  // Finland
  '赫尔辛基': [60.170, 24.935],
  '罗瓦涅米': [66.503, 25.729],
  // Estonia
  '塔林': [59.437, 24.754],
  // Montenegro
  '科托尔': [42.424, 18.771],
  // Iceland
  '雷克雅未克': [64.147, -21.942],
  '黄金圈': [64.3, -20.3],
  '维克': [63.419, -19.008],
  // Turkey
  '卡帕多奇亚': [38.643, 34.828],
  '以弗所': [37.939, 27.341],
  // 一些新法国城市
  '巴黎': [48.857, 2.352],
  '凡尔赛': [48.804, 2.120],
  '尼斯': [43.710, 7.262],
}

let fixed = 0
for (const c of travel.countries) {
  for (const city of c.cities) {
    if (Math.abs(city.lat - 48) < 0.1 && Math.abs(city.lng - 10) < 0.1) {
      const coords = coordLookup[city.name]
      if (coords) {
        city.lat = coords[0]
        city.lng = coords[1]
        fixed++
      } else {
        // Fallback: center on country's first city
        const firstCity = c.cities.find((c2) => c2.lat && Math.abs(c2.lat - 48) >= 0.5)
        if (firstCity) {
          city.lat = firstCity.lat + (Math.random() - 0.5) * 2
          city.lng = firstCity.lng + (Math.random() - 0.5) * 2
          fixed++
        }
      }
    }
  }
}

fs.writeFileSync('src/data/europe-travel.json', JSON.stringify(travel, null, 2) + '\n', 'utf-8')
console.log(`Fixed coordinates for ${fixed} cities.`)
