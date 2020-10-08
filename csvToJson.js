const fs = require('fs')

module.exports = (fileName)=>{

  try {
    const data = fs.readFileSync(fileName,'utf-8')
    
    // split the contents by new line
    const lines = data.split(/\r?\n/);
    const labels = lines[0].split(',')
    
    return lines.slice(1)
      .filter(line => !!line)
      .map(line => {
        const entry={};
        const fields=line.split(',')
        labels.forEach((value, i)=>{
          entry[value]=fields[i]
        });
    
      return entry;
    })
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('File not found!');
    }else{
      console.error(error)
    }
    return null;
  }

}