
const encode =(user)=>{
    let t =Buffer.from(JSON.stringify(user._id), 'utf8');
    return t.toString('base64')  
}

const decode =(user)=>{
    let t = Buffer.from(JSON.stringify(user._id), 'base64');
    return t.toString()  
}

const token = {encode,decode}
module.exports= token;