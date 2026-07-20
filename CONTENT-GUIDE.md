# 内容编辑指南

所有可手动编辑的内容文件都在 `src/data/` 目录下，纯 JSON 格式，用任何文本编辑器（VS Code、Obsidian、记事本）打开即可修改。修改后刷新浏览器即生效（开发模式下）。

---

## 目录速查

| 想做的事 | 编辑哪个文件 |
|----------|-------------|
| 增加/修改/删除一个国家下的景点 | `src/data/countries/<国家id>.json` |
| 调整首页 Featured 精选 | `src/data/explore-config.json` → `featured` |
| 调整首页热门城市 | `src/data/explore-config.json` → `popularCities` |
| 修改景点详情（时间/票价/交通） | `src/data/attraction-info.json` |

---

## 一、国家文件 `src/data/countries/<id>.json`

24 个国家各一个文件，文件名就是国家 ID（全小写英文，空格用 `-`）：

```
src/data/countries/
├── italy.json
├── france.json
├── germany.json
├── united-kingdom.json
├── czech-republic.json
└── ...
```

### 文件结构

```json
{
  "id": "france",
  "name": "法国",
  "nameEn": "France",
  "description": "浪漫与艺术之都...",
  "cities": [
    {
      "id": "paris",
      "name": "巴黎",
      "nameEn": "Paris",
      "attractions": [
        {
          "id": "eiffel",
          "name": "埃菲尔铁塔",
          "nameEn": "Eiffel Tower",
          "type": "landmark",
          "image": "photo-1543349689-3a4d29968ca8",
          "description": "巴黎的标志性建筑...",
          "tips": "建议黄昏时分登塔",
          "image_search_url": "https://www.bing.com/images/search?q=Eiffel+Tower+Paris"
        }
      ]
    }
  ]
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | ✅ | 唯一标识，全小写英文，用 `-` 连字符。景点 ID 全局唯一 |
| `name` | ✅ | 中文名 |
| `nameEn` | 否 | 英文名 |
| `description` | 否 | 描述文字（国家级会显示在卡片上，景点级显示在详情页） |
| `type` | ✅ | 景点类型：`landmark`（地标）、`museum`（博物馆）、`nature`（自然） |
| `image` | 否 | Unsplash 图片 ID（如 `photo-xxx`），或以 `http` 开头的完整 URL。不填则自动生成 |
| `tips` | 否 | 旅行小贴士，显示在详情页 |
| `image_search_url` | 否 | Bing 图片搜索链接，详情页"Search more images"按钮 |

### 如何添加新景点

在对应城市的 `attractions` 数组末尾添加一个对象：

```json
{
  "id": "my-new-spot",
  "name": "新景点",
  "nameEn": "New Spot",
  "type": "landmark",
  "description": "简短描述",
  "tips": "旅行建议（可选）"
}
```

添加后它会自动出现在 Explore 页面的城市详情和搜索结果中。如果想让它出现在首页 Featured，把 `id` 加到 `explore-config.json` 的 `featured` 数组。

### 如何添加新城市

在国家的 `cities` 数组末尾添加：

```json
{
  "id": "lyon",
  "name": "里昂",
  "nameEn": "Lyon",
  "attractions": []
}
```

### 如何添加新国家

1. 在 `src/data/countries/` 下新建 `新id.json`
2. 在 `src/data/explore-config.json` 的 `popularCities` 里可以加这个国家的热门城市
3. 下载一张国家封面图放到 `public/images/countries/新id.jpg`

---

## 二、配置文件 `src/data/explore-config.json`

```json
{
  "featured": [
    "eiffel",
    "colosseum",
    "sagrada",
    "acropolis",
    "neuschwanstein",
    "oia-sunset"
  ],
  "popularCities": [
    "paris", "rome", "barcelona", "london",
    "amsterdam", "prague", "vienna", "venice",
    "budapest", "lisbon", "berlin", "santorini"
  ]
}
```

- **`featured`** — Explore 首页"Featured"横滑卡片。值是景点 `id` 数组，顺序就是显示顺序
- **`popularCities`** — Explore 首页"Cities"网格。值是城市 `id` 数组，建议 8-16 个

---

## 三、景点详细信息 `src/data/attraction-info.json`

为热门景点补充真实信息（开放时间、票价、交通等）。以景点 `id` 为 key：

```json
{
  "eiffel": {
    "hours": "9:00 – 23:45 (last entry 22:30)",
    "ticketPrice": "€11.30 – €28.30 (stairs/lift)",
    "bestTime": "Spring & Autumn, sunset",
    "transport": "Metro Line 6 to Bir-Hakeim",
    "officialUrl": "https://www.toureiffel.paris"
  }
}
```

| 字段 | 说明 |
|------|------|
| `hours` | 开放时间 |
| `ticketPrice` | 票价 |
| `bestTime` | 最佳游览时间 |
| `transport` | 到达方式 |
| `officialUrl` | 官网链接（可选，有则显示"Official Website"按钮） |

没有出现在这个文件里的景点，详情页会显示默认占位文字（"Check official website"）。

---

## 四、图片资源

### 国家封面图
`public/images/countries/<国家id>.jpg`

24 个国家的封面图已就位。如要更换，直接替换同路径文件即可。推荐 800×500 以上。

### 景点图片
不需要本地文件。系统自动从 Unsplash 或 Picsum 加载。如果某张图不满意：
- 找到该景点在 country JSON 中的 `image` 字段
- 换成新的 Unsplash photo ID（从 `https://unsplash.com/photos/XXXXX` 复制 ID）
- 或者填入完整图片 URL

---

## 五、常见操作 Cheat Sheet

| 操作 | 步骤 |
|------|------|
| 首页换一组 Featured | 编辑 `explore-config.json` → `featured` 数组 |
| 首页换一批热门城市 | 编辑 `explore-config.json` → `popularCities` 数组 |
| 修改埃菲尔铁塔的票价 | 编辑 `attraction-info.json` → `eiffel.ticketPrice` |
| 给巴黎加一个新景点 | 编辑 `countries/france.json` → `cities[paris].attractions` 数组 |
| 把某景点从首页 Featured 移除 | 编辑 `explore-config.json` → 从 `featured` 数组删除该 ID |
| 修改某景点的描述文字 | 找到对应 country JSON 文件中该景点的 `description` 字段 |
| 修改某国家的描述 | 编辑对应 `countries/<id>.json` 的 `description` 字段 |

---

## 注意事项

- 所有 `id` 字段必须是**全小写英文+连字符**，且全局唯一
- 景点 `id` 在全部 24 个国家中不能重复（如只有一个 `eiffel`）
- JSON 格式严格：最后一个字段后不加逗号，字符串用双引号
- 保存文件后刷新浏览器（`Cmd+R`）即可看到效果
- 建议用 VS Code 编辑，有 JSON 语法高亮和错误提示
