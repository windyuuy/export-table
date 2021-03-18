# QuickTable 表格工具使用说明书
本工具基于旧的表格工具（ExcelExport）进行重构，与原工具保持兼容，精简了代码并加入了全新的功能，支持生成拥有样式和备注的表格；支持读取表格中的备注；支持多语言表格处理等；并且加入了数据导出模板的支持，极大提升了表格导出工具的实用性。可依据项目自定义生成导出数据。
## 表格格式定义
不同作用的表格拥有不同的格式。当前分为两种表格：数据表用于策划配置；语言文本表用于文本翻译。
### 数据表
数据表格以行为单位，每一列为一个数据字段。前三行为预留项，分别为字段标签、字段名称、字段数据类型。例如：

ID | 名称 |  解锁等级  
-|-|-
ID | name | unlocklv |
uid | string | number |
1 | 母鸡 | 10 |
2 | 公鸡 | 20 |
3 | 大肥牛 | 30 |
4 | 小猪头 | 40 |

当只配置字段标签，则表格再导出时会忽略该字段：

ID | 该字段会被忽略 | 名称 |  解锁等级  
-|-|-|-
ID |  | name | unlocklv |
uid | | string | number |
1 | 备注1 | 母鸡 | 10 |
2 | 备注2 | 公鸡 | 20 |
3 | 备注3 | 大肥牛 | 30 |
4 | 备注4 | 小猪头 | 40 |


#### 数据类型
每一个字段必须标注明确的数据类型，数据类型主要有2大作用，一是帮助策划完成基础的数值填写检查，例如一个字段指向另一张表中的某一个uid字段，此时可以字段检查目标ID是否存在；二是精确的数据类型可以自动生成常用的查询代码，提升程序的开发效率。目前支持以下数据类型：

类型 | 默认值 | 作用 |  常用写法  
-|-|-|-
any | null | 表示任何数据，通常用于一个通用性字段。一般不用。 | 可填写任何值，数值不会经过任何处理 |
uid | 0 | 表示该表的主键，一般一张表只有一个该字段，导出时会检查该列是否有重复项 | 从1开始依次累加 |
fk | 0 | 表示外键，指向当前表或另一张表中的某一个uid字段，导出时会自动检查目标id是否存在并生成程序所使用的快速查询代码，填写是需要附加表名和字段名。例如：fk gameconfig id 表示指向 gameconfig表中的id字段，当fk指向非uid类型的字段，则将理解为可匹配多行 | 整数或留空 |
fk[] | [] | 功能与fk相同，这里可以表示一个数组来指向多个id。例如：fk[] skillconfig id | 用分号分割每一项。如：1001;1002;1003 |
key | "" | 该字段主要用于生成一张键值查找的map，例如从某个字符串可以快速拿到某一行数据，可以提升程序查询数据的效率 | 不重复的字符串 |
number | 0 | 数值 | 任何数字 |
number[] | [] | 数值数组 | 用分号分割，例如:1.5;2.5;3 |
bool | false | 布尔值 | 可填写true或false，或者用 1 0 表示 |
bool[] | [] | 布尔值数组 | 同上，用分号分割 true;true;false 或 1;1;0 |
string | "" | 字符串 | 字符串文本 |
string[] | [] | 字符串数组 | 使用两个连续的逗号或分号分割每一段字符串例如：怪物1,,怪物2,,怪物3 又如：怪物1;;怪物2;;怪物3 |
string* | "" | 需要翻译的字符串 | 功能与文本相同 |
object | null | 可以填写任何Json对象，通常不建议使用，因为这会导致程序不能准确识别里面的类型，不能在运行前得知里面是否有错误 | 例如 {"a":1,"b":666,"c":[1,2,3]} |
object[] | [] | 功能同上，但能保证导出后是一个数组，即使只填写了一个对象 | 例如 [1,2,3] 或 [{"a":1,"b":666,"c":[1,2,3]},2,[3,3,3]] |

#### key的用法
ID | 键 |  值  | 表述
-|-|-|-
ID | key | value | des
uid | key | any | string
1 | mailUnlock | 10 | 邮箱解锁等级 |
2 | shareOpen | true | 开启分享 |
3 | eggUnlcok | 20 | 扭蛋解锁等级 |
4 | fps | 30 | 游戏运行帧数 |

#### fk的用法
heroconfig 英雄表

英雄ID | 英雄 |  技能列表  
-|-|-
id | name | skills |
uid | string | fk[] skillconfig id |
1 | 皮卡丘 | 1001;1002;1003 |
2 | 妙蛙花 | 2001;2002;2003 |
3 | 妙蛙种子 | 2001;2002;2003;3001 |
4 | 水箭龟 | 4001;4002;999 |

skillconfig 技能表

技能ID | 技能名称 |  攻击力 | 攻击方式
-|-|-|-
id | name | attack | attacktype
uid | string | number | fk attacktypeconfig id
1001 | 放电 | 100 | 1
1002 | 十万伏特 | 1000 | 2
1003 | 撞击 | 200 | 1

attacktypeconfig 攻击方式表

ID | 名称 |  其他属性  
-|-|-
id | name | ... |
uid | string | ... |
1 | 普通攻击 | ... |
2 | 范围攻击 | ... |


### 语言文本表
语言文本用于多语言翻译，第一列必然为key用于程序查找，之后每一列对应一种语言，例如：

key | zh |  en  
-|-|-
name | 名称 | Name |
net.error | 网络连接异常，请重试！ | Network error,please retry. |
levelup | 升级啦！！ | LEVEL UP!!! |
ok | 确认 | Ok |

## 命令行
以下内容需要项目组主程完全掌握
### 表格导出
导出表格，可以每张表格单独导出，或是全部数据一起导出。
```shell
$ ccf QuickTable export ../../Excel ../../assets/resources/scripts/configs --one {template}/export_ts.razor --onename name.ts --alls {template}/tableinit_ts.razor --allnames TableInit.ts
```
导出的具体可是可以参考对应的.razor模板文件。
> {template} 可自动指向工具中默认模版目录

### 导出C#代码
```shell
$ ccf QuickTable export2 excel_dir output_dir --one cs --onename name.cs
```

### 多语言表生成
从表格中抽取 string* 类型的字段，并合并值local.xlsx文件中。
```shell
$ ccf QuickTable genlocal ../../Excel ../../local.xlsx
```

### Cocos项目字符串文件生成
对Cocos项目界面文件和代码文件进行字符串key提取
```shell
$ ccf QuickTable genccstrings ../RelaxFarm/assets ../../strings.xlsx
```

### 语言数据导出
拆分语言表中的每一列，分别生成多个文件。具体文件格式可以参考对应的.razor模板文件。
```shell
$ ccf QuickTable splitlocal ../../strings.xlsx ../RelaxFarm/assets/resources/localization/ -t {template}/splitlocal_json.razor -n strings_lang.json
```

## 模板介绍

### export_ts.razor
生成对应表格的模型，以及数据。如果注入`nulldata`则将会不导出数据，可以配合`tabledatas_json.razor`使用。

### tabledatas_json.razor
将所有表格加密并导出一个json文件，使表格数据与代码分离。

### tableinit_ts.razor
导出一个函数，用于将 `tabledatas_json.razor` 的数据赋值到 `export_ts.razor` 的模型中，往往在`nulldata`时使用。

### applylocal_ts.razor
导出一个处理函数，用于将`语言表`所导出的数据映射到当前的表中，使语言数据覆盖到当前表中。配合 `splitlocal_ts.razor` 或 `splitlocal_json.razor` 使用

### splitlocal_ts.razor splitlocal_json.razor
将多`语言表`拆分导出单个文件的模板，分别导出json和ts格式，一般推荐使用json文件，往往翻译文本会比较大，建议和代码分离。