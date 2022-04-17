
const encode =(user)=>{
    let t =Buffer.from(JSON.stringify({_id:user._id,time:Date.now()}), 'utf8');
    return t.toString('base64')
}

const decode =(user)=>{
    let t = Buffer.from(JSON.stringify(user._id), 'base64');
    let obj = JSON.parse(t.toString())
    return  JSON.parse(t.toString())._id
}

const token = {encode,decode}
module.exports= token;
