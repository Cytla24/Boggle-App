// Aimie Ojuba @02837763
// This file is linted through eslint standard style
// /**
//  * Given a Boggle board and a dictionary, returns a list of available words in
//  * the dictionary present inside of the Boggle board.
//  * @param {string[][]} grid - The Boggle game board.
//  * @param {string[]} dictionary - The list of available words.
//  * @returns {string[]} solutions - Possible solutions to the Boggle board.
//  */

// var json = require("./full-wordlist.json");

function findAllSolutions (grid, dictionary) {
  let solutions = []

  if (dictionary === [] || grid === [[]] || grid === []) {
    return solutions
  }

  /* global megaFound:writable final:writable temp:writable visited:writable stack:writable */
  // checks through dictionary for valid wordsm and passes them into the find function to get the coordinate of the first letter
  for (var i of dictionary) {
    final = []
    temp = []
    if (i.length < 3) {
      continue
    }
    megaFound = false
    find(grid, dictionary, i, i[0], 1)
    //   Calls the help function to perform DFS on the list of coordinates (temp)
    for (var q of temp) {
      visited = {}
      stack = []
      visited[q] = true
      if (i[0].toUpperCase() === 'Q' && i[1].toUpperCase() === 'U') {
        help(grid, q[0], q[1], i, i.slice(2))
      } else {
        help(grid, q[0], q[1], i, i.slice(1))
      }
    }
    solutions = solutions.concat(final)
  }
  return solutions
}

/* Performs the bulk of the recursion. Performs a DFS on the node - grid(xval, yval) and compares
 * letter by letter to the word passed in
 * @param {string[][]} grid - The Boggle game board.
 * @param {int} xval - The x coordinate of the letter being compared in the grid
 * @param {int} yval - The y coordinate of the letter being compared in the grid
 * @param {string} word - The word in the dictionary, currently being verified
 * @param {string} rword (rest of word) - the substring of the word being verified
 */
function help (grid, xval, yval, word, rword) {
//   base case
  if (rword === '' && !(megaFound)) {
    final.push(word)
    megaFound = true
    return
  }
  //  returns if a solution has been found - prevents duplicates returns
  if (megaFound) {
    return
  }
  var first = rword[0].toUpperCase()
  if (first.toUpperCase() === 'Q') {
    if (rword[1] && rword[1].toUpperCase() === 'U') {
      first = 'Qu'
      //         rword = rword.slice(2);
    } else {
      return
    }
  }
  var listFound = []
  //   checks all valid nodes, and adds it to a temporary buffer
  if (xval - 1 >= 0 && grid[xval - 1][yval].toUpperCase() === first.toUpperCase() && !([xval - 1, yval] in visited)) {
    listFound.push([xval - 1, yval])
  }
  if ((xval - 1 >= 0 && yval - 1 >= 0 && grid[xval - 1][yval - 1].toUpperCase() === first.toUpperCase() && !([xval - 1, yval - 1] in visited))) {
    listFound.push([xval - 1, yval - 1])
  }
  if (xval - 1 >= 0 && yval + 1 < grid[0].length && grid[xval - 1][yval + 1].toUpperCase() === first.toUpperCase() && !([xval - 1, yval + 1] in visited)) {
    listFound.push([xval - 1, yval + 1])
  }
  if (yval - 1 >= 0 && grid[xval][yval - 1].toUpperCase() === first.toUpperCase() && !([xval, yval - 1] in visited)) {
    ;
    listFound.push([xval, yval - 1])
  }
  if (yval + 1 < grid[0].length && grid[xval][yval + 1].toUpperCase() === first.toUpperCase() && !([xval, yval + 1] in visited)) {
    listFound.push([xval, yval + 1])
  }
  if (xval + 1 < grid.length && grid[xval + 1][yval].toUpperCase() === first.toUpperCase() && !([xval + 1, yval] in visited)) {
    listFound.push([xval + 1, yval])
  }
  if (xval + 1 < grid.length && yval - 1 >= 0 && grid[xval + 1][yval - 1].toUpperCase() === first.toUpperCase() && !([xval + 1, yval - 1] in visited)) {
    listFound.push([xval + 1, yval - 1])
  }
  if (xval + 1 < grid.length && yval + 1 < grid[0].length && grid[xval + 1][yval + 1].toUpperCase() === first.toUpperCase() && !([xval + 1, yval + 1] in visited)) {
    listFound.push([xval + 1, yval + 1])
  }
  //   calls help(DFS) recursively on all found nodes
  for (var node of listFound) {
    if (rword === '') {
      final.push(word)
      return
    }
    visited[node] = true
    stack.push(node)
    //     console.log(visited, stack);
    if (first.toUpperCase() === 'QU') {
      help(grid, node[0], node[1], word, rword.slice(2))
    } else {
      help(grid, node[0], node[1], word, rword.slice(1))
    }
    first = rword[0].toUpperCase()
  }

  var removedNode = stack.pop()
  delete visited[removedNode]
}

/* populates the "temp" list with the coordinates of the first letter of all eligible words
 * @param {string[][]} grid - The Boggle game board.
 * @param {string[]} dictionary - The list of available words.
 * @param word - current word in the dictionary
 * @param letter - letter to find in dictionary
 * @param k - counter to slice word
 */
function find (grid, dictionary, word, letter, k) {
  if (letter === '') {
    return
  }
  var l = 0
  var found = false
  while (l < grid.length) {
    var j = 0
    while (j < grid[0].length) {
      if (grid[l][j].toUpperCase() === letter.toUpperCase()) {
        temp.push([l, j])
        found = true
      }
      j += 1
    }
    l += 1
  }
  if (found) {

  } else {
    k++
    find(grid, dictionary, word, word.slice(0, k))
  }
}
// const grid = [['T', 'W', 'Y', 'R', 'R'],
//   ['R', 'N', 'P', 'H', 'R'],
//   ['G', 'Z', 'Qu', 'R', 'R'],
//   ['O', 'N', 'T', 'A', 'R'],
//   ['T', 'z', 'Y', 'R', 'R'],
//   ['R', 'N', 'P', 'H', 'R'],
//   ['G', 'Z', 'Qu', 'R', 'R'],
//   ['O', 'N', 'T', 'A', 'R']]
// const dictionary = json.words


// console.log(exports.findAllSolutions(grid, dictionary));

exports.findAllSolutions = findAllSolutions;
