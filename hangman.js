const givenLetters = [];
const sentence = 'INSERT A PHRASE HERE'.split('') ?? [];

export function update(newLetter) {
  if (!givenLetters.includes(newLetter)) {
    givenLetters.push(newLetter);
  }
  return sentence.includes(newLetter);
}

export function draw(hangmanboard, lettersboard, leaderboard) {
  sentence.forEach((l) => {
    const letterElement = document.createElement('span');
    if (l === ' ') {
      letterElement.innerText = '-';
    } else if (givenLetters.includes(l)) {
      letterElement.innerText = l;
    } else {
      letterElement.innerText = '_';
    }
    letterElement.innerText += ' ';
    letterElement.classList.add('letter');
    hangmanboard.appendChild(letterElement);
  });

  givenLetters.forEach((l) => {
    if (!sentence.includes(l)) {
      lettersboard.innerText += l;
    }
  });

  const allProfiles = Object.keys(localStorage);
  const allEntries = allProfiles
    .map((profile) => {
      let entry = JSON.parse(localStorage.getItem(profile));
      return { profile, ...entry };
    })
    .sort((current, previous) => previous.points - current.points);
  allEntries.forEach((entry) => {
    const leaderboardElement = document.createElement('li');
    leaderboardElement.innerHTML = `<h1>${entry.profile || 'Unknown'} → ${entry.points} (found: ${entry.wordFound ? 'yes' : 'no'})</h1>`;
    leaderboard.appendChild(leaderboardElement);
  });
}

export function hasFoundTheWord() {
  return sentence
    .filter((l) => l !== ' ')
    .every((l) => givenLetters.includes(l));
}
