const pdlist = [
  {
    'id': 1,
    'pdImg': './static/mock/img/pd1.jpg',
    'pdName': '【1】  六罐装荷兰美素佳儿金装2段900g',
    'pdPrice': 1149.00,
    'pdSold': 648
  }, {
    'id': 2,
    'pdImg': './static/mock/img/pd2.jpg',
    'pdName': '【2】  韩国Amore爱茉莉红吕洗发水套装修复受损发质',
    'pdPrice': 89.00,
    'pdSold': 128
  }, {
    'id': 3,
    'pdImg': './static/mock/img/pd3.jpg',
    'pdName': '【3】  Friso美素佳儿 金装婴儿配方奶粉3段900g',
    'pdPrice': 195.00,
    'pdSold': 968
  }, {
    'id': 4,
    'pdImg': './static/mock/img/pd4.jpg',
    'pdName': '【4】  Fisher pdPrice费雪 费雪三轮儿童滑行车',
    'pdPrice': 299.00,
    'pdSold': 85
  }, {
    'id': 5,
    'pdImg': './static/mock/img/pd5.jpg',
    'pdName': '【5】  Babylee巴布力 实木婴儿床 雷卡拉130*70cm',
    'pdPrice': 1889.00,
    'pdSold': 18
  }, {
    'id': 6,
    'pdImg': './static/mock/img/pd6.jpg',
    'pdName': '【6】  Pigeon贝亲 独立三层奶粉盒 送小罐奶粉1段200g',
    'pdPrice': 70.00,
    'pdSold': 658
  }, {
    'id': 7,
    'pdImg': './static/mock/img/pd7.jpg',
    'pdName': '【7】 TTBOO兔兔小布 肩纽扣套装',
    'pdPrice': 268.00,
    'pdSold': 128
  }, {
    'id': 8,
    'pdImg': './static/mock/img/pd8.jpg',
    'pdName': '【8】  Nuna璐拉 婴儿布里奇果精纯嫩肤沐浴露婴儿精纯芦荟胶',
    'pdPrice': 140.00,
    'pdSold': 366
  }, {
    'id': 9,
    'pdImg': './static/mock/img/pd9.jpg',
    'pdName': '【9】  illuma启赋 奶粉3段900g',
    'pdPrice': 252.00,
    'pdSold': 98
  }, {
    'id': 10,
    'pdImg': './static/mock/img/pd10.jpg',
    'pdName': '【10】  Abbott雅培乳蛋白部分水解婴儿配方奶粉3段820g',
    'pdPrice': 89.00,
    'pdSold': 128
  }, {
    'id': 11,
    'pdImg': './static/mock/img/pd11.jpg',
    'pdName': '【11】  韩蜜 酷炫唇蜜（礼盒套装）2.8g*4',
    'pdPrice': 179.00,
    'pdSold': 35
  }, {
    'id': 12,
    'pdImg': './static/mock/img/pd12.jpg',
    'pdName': '【12】  保税区直发【3包装】日本Merries花王纸尿裤NB90',
    'pdPrice': 289.00,
    'pdSold': 1928
  }, {
    'id': 13,
    'pdImg': './static/mock/img/pd13.jpg',
    'pdName': '【13】  Comotomo可么多么 硅胶奶瓶（0-3月奶嘴）150ml绿色',
    'pdPrice': 203.00,
    'pdSold': 87
  }, {
    'id': 14,
    'pdImg': './static/mock/img/pd14.jpg',
    'pdName': '【14】  香港直邮德国瑞德露Rival de Loop芦荟精华安瓶',
    'pdPrice': 152.00,
    'pdSold': 61
  }, {
    'id': 15,
    'pdImg': './static/mock/img/pd15.jpg',
    'pdName': '【15】  保税区直发药师堂尊马油香草味温和保湿无刺激面霜',
    'pdPrice': 269.00,
    'pdSold': 73
  }, {
    'id': 16,
    'pdImg': './static/mock/img/pd16.jpg',
    'pdName': '【16】  香港直邮日本Spatreatment眼膜保湿去细纹法令纹',
    'pdPrice': 219.00,
    'pdSold': 13
  }, {
    'id': 17,
    'pdImg': './static/mock/img/pd17.jpg',
    'pdName': '【17】  韩国MEDIHEALNMF可莱丝针剂睡眠面膜',
    'pdPrice': 81.00,
    'pdSold': 128
  }, {
    'id': 18,
    'pdImg': './static/mock/img/pd18.jpg',
    'pdName': '【18】  DHC蝶翠诗橄榄蜂蜜滋养洗脸手工皂90g',
    'pdPrice': 123.00,
    'pdSold': 77
  }, {
    'id': 19,
    'pdImg': './static/mock/img/pd19.jpg',
    'pdName': '【19】  日本资生堂CPB肌肤之钥新版隔离霜 清爽型 30ml',
    'pdPrice': 429.00,
    'pdSold': 36
  }, {
    'id': 20,
    'pdImg': './static/mock/img/pd20.jpg',
    'pdName': '【20】 Heinz亨氏 婴儿面条优加面条全素套餐组合3口味3盒',
    'pdPrice': 39.00,
    'pdSold': 61
  }, {
    'id': 21,
    'pdImg': './static/mock/img/pd21.jpg',
    'pdName': '【21】  Heinz亨氏 乐维滋果汁泥组合5口味15袋',
    'pdPrice': 69.00,
    'pdSold': 55
  }, {
    'id': 22,
    'pdImg': './static/mock/img/pd22.jpg',
    'pdName': '【22】  保税区直发澳大利亚Swisse高浓度蔓越莓胶囊30粒',
    'pdPrice': 271.00,
    'pdSold': 19
  }, {
    'id': 23,
    'pdImg': './static/mock/img/pd23.jpg',
    'pdName': '【23】  挪威Nordic Naturals小鱼婴幼儿鱼油DHA滴剂',
    'pdPrice': 102.00,
    'pdSold': 125
  }, {
    'id': 24,
    'pdImg': './static/mock/img/pd24.jpg',
    'pdName': '【24】  澳大利亚Bio island DHA for Pregnancy海藻油DHA',
    'pdPrice': 289.00,
    'pdSold': 28
  }, {
    'id': 25,
    'pdImg': './static/mock/img/pd25.jpg',
    'pdName': '【25】  澳大利亚Fatblaster Coconut Detox椰子水',
    'pdPrice': 152.00,
    'pdSold': 17
  }, {
    'id': 26,
    'pdImg': './static/mock/img/pd26.jpg',
    'pdName': '【26】  Suitsky舒比奇 高护极薄舒爽纸尿片尿不湿XL60',
    'pdPrice': 99.00,
    'pdSold': 181
  }, {
    'id': 27,
    'pdImg': './static/mock/img/pd27.jpg',
    'pdName': '【27】  英国JUST SOAP手工皂 玫瑰天竺葵蛋糕皂',
    'pdPrice': 72.00,
    'pdSold': 66
  }, {
    'id': 28,
    'pdImg': './static/mock/img/pd28.jpg',
    'pdName': '【28】  德国NUK 多色婴幼儿带盖学饮杯',
    'pdPrice': 92.00,
    'pdSold': 138
  }
]

export default pdlist
