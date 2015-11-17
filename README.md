city
========

一款用于生成行政区划联动数据的小工具，如

```json
[{
    "name":"北京市",
    "children":[{
        "name":"东城区"
    },{
        "name":"西城区"
    }]
},{
    "name":"天津市",
    "children":[{
        "name":"和平区"    
    }]    
}]
```

### 特色

- 数据权威，来自国家统计局，每年更新
- 自由选择是否包含海外国家列表数据（来自维基百科）
- 自由选择生成一级（省）、二级（省市）、三级（省市县）数据
- 可自定义数据对象键名（key）
- 支持输出JSON、原生js文件、AMD/CMD规范js文件
- 支持输出压缩后的代码及格式化后的代码
- 支持输出地区代码（身份证前6位）
- 支持拼音输出
- 支持自定义去除 省|市|区|地区|县 等后缀

### 使用方法

使用npm安装

```sh
npm install -g city
```

使用：

```sh
city
```

支持参数：

- `-V` `--version` 输出版本号
- `-h` `--help` 输出菜单
- `-l` `--level level` 输出指定级别行政区数据，取值1-3
- `-k` `--key name,children,code` 自定义输出格式中的对象键名（必须包含三个值）
- `-o` `--output fileName` 输出文件路径
- `-j` `--js varibleName` 以指定变量名输出js文件（配合`--output`选项写入文件）
- `-a` `--amd` 以AMD规范输出js文件
- `-m` `--cmd` 以CMD规范输出js文件
- `-p` `--pretty` 格式化输出
- `-s` `--overseas` 包含海外地区
- `-c` `--code` 包含地区编码（身份证前6位）
- `-u` `--update` 重新抓取原始数据
- `-y` `--pinyin` 输出pinyin
- `-i` `--ignore '省|市|区|地区|县'` 忽略 省|市|区|地区|县

### Todo

- [ ] 海外地区支持按拼音排序<https://github.com/TooBug/city/issues/1>
- [ ] 支持更多格式的输出<https://github.com/TooBug/city/issues/2>
