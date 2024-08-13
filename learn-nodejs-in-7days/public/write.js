const fs = require("fs")
const iconv = require('iconv-lite');
const readline = require("readline");
const fetch = require("node-fetch")

async function searchCombos(name) {

  const baseUrl = 'https://doctor.tclab.cn/user/home/query/packageByFilter'
  const url = (`${baseUrl}?cityName=%E6%9D%AD%E5%B7%9E%E5%B8%82&queryParam=${name}&lable1`)
  return await fetch(url, {
    method: 'GET'
  })
}

function replace(value) {
  const pattern = /[\'\"‘’”“\,\，\、\s]/g;
  return value.replace(pattern, "");

}

const getNames = (() => {
  return new Promise(async (resolve) => {
    const stream = fs.createReadStream(__dirname + "/names.txt", "utf-8");
    // 创建一个 readline 接口
    // 注意 crlfDelay 参数，让它支持多种换行符(CR LF ('\r\n'))
    const rl = readline.createInterface({
      input: stream, crlfDelay: Infinity
    });
    const data = []
    for await (const line of rl) {
      // 文件中的每一行都会依次被 line 变更接收
      // console.log(`Line from file: ${line}`);
      data.push(replace(line))
    }
    resolve(data.filter(Boolean))
  })
})

let list = []
getNames().then(async data => {
  let res
  const newData = {}
  for (let i = 0; i < data.length; i++) {
    // list.push(searchCombos(data[i]))
    res = await searchCombos(data[i])
    const item = await res.json()
    if (item.data.length === 0) {
      newData[data[i]] = []
    } else {
      newData[data[i]] = item.data.map(v => {
        return {
          packageId: v.packageId, packageCurrentPrice: v.packageCurrentPrice, packageName: v.packageName
        }
      })
    }
  }

  console.log(newData)
  const content = JSON.stringify(newData);
  const opt = {
    flag: 'a' // a：追加写入；w：覆盖写入
  }

  fs.writeFile('list.json', content, opt, (err) => {
    if (err) {
      console.error(err)
    }
  })
  // {
  //   name:[
  //    {
  //      packageId，packageCurrentPrice，packageName
  //    }
  //   ]
  // }

})
