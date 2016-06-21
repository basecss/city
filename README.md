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
- `-k` `--key name,children,code,pinyin` 导出的键名（顺序不能改变，例如n,s,c,p）
- `-f` `--flat 'parentId'` 扁平化输出，可以指定parentId参数名称
-      `--closed` 地区树结点默认为关闭状态
-      `--father` 转出指定父节点的所有子节点，不含父节点
- `-r` `--reserve` 转出以子节点为根的树，便于倒查父节点

示例：
1. 嵌套方式列出所有地区，name改为n，children改为s，code改为c，并带上地区编码
```sh
city -k n,s,c -o ./area.json -c
```

2. 平面方式列出所有地区，name改为n，children改为s，code改为c，parentId为p，并带上地区编码
```sh
city -k n,s,c -o ./flat-area.json -c -f p
```

3. 倒树方式列出所有地区，子地区的code为key，val为父地区的{code:code, name:name};
```sh
city -k n,s,c -o ./reverse-area.js -j reverse_area -r
```

### Todo

- [ ] 海外地区支持按拼音排序<https://github.com/TooBug/city/issues/1>
- [ ] 支持更多格式的输出<https://github.com/TooBug/city/issues/2>
