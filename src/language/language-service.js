const SLL = require('../utils/singly-linked-list');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getNext(db, language_id){
    return db
      .from('word')
      .join('language', 'word.id','=','language.head')
      .select(
        'original',
        'language_id',
        'correct_count',
        'incorrect_count'
      )
      .where({language_id});
  },
  populateSLL(wordArr, headValue){
    const wordList = new SLL()
    wordList.insertFirst(headValue)

    let curr = headValue
    while (curr.next !== null) {
      curr = wordArr.find(word => word.id === curr.next)
      wordList.insertLast(curr)
    }
    return wordList
  },
  addWords(db, words, language_id, total_score) {
    return db 
      .transaction(async trx => {
        return Promise.all([trx('language')
                .where({id: language_id})
                .update({total_score, head: words[0].id}),

                ...words.map((word, index) => {

                  if(index+1 >= words.length) {
                    word.next = null
                    words[index-1].next = word
                  }
                  else {
                    word.next = words[index + 1].id
                  }
                  return trx('word').where({id: word.id}).update({...word})
                })
        ])

      })
  },
  
}

module.exports = LanguageService
