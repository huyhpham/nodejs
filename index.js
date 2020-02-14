const fs = require('fs');
const http = require('http');
const url = require('url');

//Server
const replaceTemplate = (template, item) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, item.productName);  
    output = output.replace(/{%IMAGE%}/g, item.image);
    output = output.replace(/{%PRICE%}/g, item.price); 
    output = output.replace(/{%FROM%}/g, item.from); 
    output = output.replace(/{%NUTRIENTS%}/g, item.nutrients); 
    output = output.replace(/{%QUANTITY%}/g, item.quantity); 
    output = output.replace(/{%DESCRIPTION%}/g, item.description);
    output = output.replace(/{%ID%}/g, item.id);
    
    if(!item.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview =  fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard =  fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct =  fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data =  fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;
    
    //Overview page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const cardsHtml = dataObj.map(item => replaceTemplate(tempCard, item)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
        
    //Product page
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');
        
    //API
    } else if (pathName === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
        
    //Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-heder': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000');
});