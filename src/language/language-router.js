const express = require('express')
const jsonParser = express.json()
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try{
      const [nextWord] = await LanguageService.getNext(
        req.app.get('db'),
        req.language.id
      )
      res.json({
        nextWord: nextWord.original,
        totalScore: req.language.total_score,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
      })
      next()
    }
    catch(error) {
      next(error)
    }
  })


languageRouter
  .use(requireAuth)
  .post('/guess', jsonParser, async (req, res, next) => {

    if (!req.body.guess) {
      res.status(400).json({
        error: `Missing 'guess' in request body`,
      })
    } else try {
      //get words
      const wordArr = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      //get head
      const headValue = wordArr.find(word => word.id = req.language.head)
      //create SLL
      const wordList = await LanguageService.populateSLL(wordArr, headValue)
      
      let isCorrect
      let head = wordList.head
      let translation = wordList.head.value.translation
      let nextWord = head.next.value.original
      let correct_count = head.next.value.correct_count
      let memory_value = head.value.memory_value
      
      if (req.body.guess === translation) {
        isCorrect = true
        req.language.total_score++
        head.value.correct_count++
        memory_value *= 2
        head.value.memory_value = memory_value
        wordList.head = head.next
        if (memory_value > 9) {
          memory_value = 9
          head.value.memory_value = memory_value
        }
        wordList.insertAt(head.value, memory_value)

      } else {
        isCorrect = false
        wordList.head.value.incorrect_count += 1
        head.value.memory_value = 1
        wordList.head = head.next
        wordList.insertAt(head.value, memory_value)
      }
      
      let results = {
        answer: translation,
        isCorrect: isCorrect,
        nextWord: nextWord,
        totalScore: req.language.total_score,
        wordCorrectCount: correct_count,
        wordIncorrectCount: wordList.head.value.incorrect_count
      };
      
      let newWordArr = [];
      let currNode = wordList.head
      while (currNode.next !== null) {
        newWordArr = [...newWordArr, currNode.value]
        currNode = currNode.next
      }
      newWordArr = [...newWordArr, currNode.value]
      await LanguageService.addWords(req.app.get('db'), newWordArr, req.language.id, req.language.total_score)
      
      res.status(200).json(results)
    
    }
    catch(error) {
      next(error)
    }
  })
  
  

module.exports = languageRouter
