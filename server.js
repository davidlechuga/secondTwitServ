var express = require('express');
const config = require ('./config')
require('dotenv').config()
var app = express();

app.use(require('cors')());
app.use(require('body-parser').json());


 
 /* ::::::::  EXTRACCION DE LOS ULTIMOS TWITS  ::::::::.  */ 

app.get('/tweets',async (req,res) => {

    const params = {count:3, tweet_mode: 'extended' };
    const dataTweets = await config.apiClient.get('statuses/home_timeline', params)
    .then((data)=>{
        console.log(`aqui esta la : ${data}`)
        return data;
    }
    )

    console.log('Data tweets')
    console.log(dataTweets)

    res.json({
            success: true,
            message: "Tweets Ok",
            payload: {tweets: dataTweets}

    })
});



 /* ::::::::  EXTRACCION DE LOS TWITS POR PALABRA CLAVE  ::::::::.  */ 

app.get('/search/:word',(req,res) => {

    const params = {count:3, tweet_mode: 'extended', q: req.params.word, result_type: 'recent', lang: 'es'};
    config.apiClient.get('search/tweets', params)
    .then(results => {
        res.send(results)
    })
    .catch(error => {
        res.send(error)
    })
});


 /* ::::::::  PALABRAS CLAVE IBM ::::::::.  */ 

 app.get('/resumenes', async (req, res) => { 

  const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
  const { IamAuthenticator } = require('ibm-watson/auth');

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  url: process.env.URL,
});

const analyzeParams = {
  'url': 'https://twiitgov.mybluemix.net/search/marihuana',
  'features': {
    'keywords': {
      'sentiment': true,
      'emotion': true,
      'limit': 3
    }
  }
};

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
   const data = analysisResults

  console.log(`esto es ${data}`);

   res.json ({
    success: true,
    message: 'IBM ANALYZER',
    payload: data.result.keywords

    })
  })
  .catch(err => {
    console.log('error:', err);
  });
  
})



/* ::::::::  SENTIMIENTO IBM ::::::::.  */ 


// const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
// const { IamAuthenticator } = require('ibm-watson/auth');

// const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
//   version: '2019-07-12',
//   authenticator: new IamAuthenticator({
//     apikey: process.env.API_KEY,
//   }),
//   url: process.env.URL
// });

// const analyzeParams = {
//   'url': 'https://twiitgov.mybluemix.net/search/AMLO',
//   'features': {
//     'sentiment': {
//       'targets': [
//         'data'
//       ]
//     }
//   }
// };

// naturalLanguageUnderstanding.analyze(analyzeParams)
//   .then(analysisResults => {
//     console.log(JSON.stringify(analysisResults, null, 2));
//   })
//   .catch(err => {
//     console.log('error:', err);
//   });


/* ::::::::  CATEGORIES IBM  ::::::::  */ 

// const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
// const { IamAuthenticator } = require('ibm-watson/auth');

// const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
//   version: '2019-07-12',
//   authenticator: new IamAuthenticator({
//     apikey: process.env.API_KEY,
//   }),
//   url: process.env.URL,
// });

// const analyzeParams = {
//   'url': 'https://twiitgov.mybluemix.net/search/marihuana',
//   'features': {
//     'categories': {
//       'limit': 3
//     }
//   }
// };

// naturalLanguageUnderstanding.analyze(analyzeParams)
//   .then(analysisResults => {
//     console.log(JSON.stringify(analysisResults, null, 2));
//   })
//   .catch(err => {
//     console.log('error:', err);
//   });



/* ::::::::  EMOCIONES IBM ::::::::.  */ 

// const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
// const { IamAuthenticator } = require('ibm-watson/auth');

// const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
//   version: '2019-07-12',
//   authenticator: new IamAuthenticator({
//     apikey: process.env.API_KEY
//   }),
//   url: process.env.URL
// });

// const analyzeParams = {
//   'url': 'https://twiitgov.mybluemix.net/search/Trump',
//     'features': {
//     'emotion': {
//       'targets': [
//         'data'
//       ]
//     }
//   }
// };

// naturalLanguageUnderstanding.analyze(analyzeParams)
//   .then(analysisResults => {
//     console.log(JSON.stringify(analysisResults, null, 2));
//   })
//   .catch(err => {
//     console.log('error:', err);
//   });



/* ::::::::  ENTIDADES IBM ::::::::.  */ 

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  url: process.env.URL,
});

const analyzeParams = {
  'url': 'https://twiitgov.mybluemix.net/search/Trump',
  'features': {
    'entities': {
      'sentiment': true,
      'limit': 1
    }
  }
};

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 1));
  })
  .catch(err => {
    console.log('error:', err);
  });


app.listen(config.port,() => {

   console.log(`runing on port ${config.port}`);
    
});