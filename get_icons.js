const https = require('https');
['openai', 'canva', 'trello', 'microsoftteams'].forEach(name => {
    https.get('https://unpkg.com/simple-icons@v14/icons/' + name + '.svg', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => console.log(name + ' SVG:\n' + data + '\n'));
    });
});
