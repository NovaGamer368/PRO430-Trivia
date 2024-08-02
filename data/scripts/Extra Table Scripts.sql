use Time4Trivia;

-- Trivia Questions section START
drop table if exists TriviaQuestions;


create table if not exists TriviaQuestions(
	TriviaId int NOT NULL AUTO_INCREMENT,
	Question varchar(200) NOT NULL,
	WrongAnswer1 varchar(100) NOT NULL,
    WrongAnswer2 varchar(100) NOT NULL,
    WrongAnswer3 varchar(100) NOT NULL,
	CorrectAnswer varchar(100) NOT NULL,
    Points bigint NOT NULL,
	PRIMARY KEY (TriviaId)
);

insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ("How many days are in the months March, April and May combined?", 
		'90', '91', '93', 
        '92', 100);
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ("According to IMDB how many actors appear in the viral internet sensation Too Many Cooks?", 
		'37', '37', '57', 
        '67', 100);
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ('What is the final line of Dr. Suess\'s "Oh the Places You\'ll Go?"', 
		'Oh what a day!', 'No time for delay.', "But maybe I'll stay.", 
        'So... get on your way!', 100);
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ('How much life does each player start with in a basic game of Magic: The Gathering?', 
		'40', '60', "80", 
        '20', 100);
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ("What's the name of the professor that guides players through the basics of Pokemon hunting in Pokemon Go?", 
		'Professor Birch', 'Professor Oak', "Professor Bark", 
        'Professor Willow', 100);
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ("Which of the following movies does NOT involve flesh eating zombies?", 
		'Land of the Dead', 'Dead Snow', "Dead Alive", 
        'Bringing Out the Dead', 100);
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ('How many times does the phrase "Let it go" appear in the song "Let It Go"?', 
		'6', '18', "24", 
        '12', 100);        
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ("How much of that glorious Papa John's garlic dipping sauce comes in a container?", 
		'2 oz', '3 oz', "4 oz", 
        '1 oz', 100);
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ("Who's got the biggest head?", 
		'The Statue of Liberty', 'Christ the Redeemer', "The Thinker", 
        "Mt. Rushmore's Teddy Roosevel", 100);
insert into TriviaQuestions (Question, WrongAnswer1, WrongAnswer2, WrongAnswer3, CorrectAnswer, Points) 
values ("What was Princess Peach's original name in Super Mario Bros. ?", 
		'Princess Buttercup', 'Princess Star', "Princess Mushroom", 
        "Princess Toadstool", 100);
-- Trivia Questions section END

-- Leaderboard section Start
drop table if exists Leaderboard;

create table if not exists Leaderboard(
	EntryId int NOT NULL AUTO_INCREMENT,
	Username varchar(200) NOT NULL,
    Score bigint NOT NULL,
    DateCompleted datetime NOT NULL,
	PRIMARY KEY (EntryId)
);

insert into Leaderboard (Username, Score, DateCompleted) values ("xBestAdminx", 1000, '	2008-11-11 13:23:44');
insert into Leaderboard (Username, Score, DateCompleted) values ("Trivia_GOD", 700, '	2008-11-11 13:23:44');
insert into Leaderboard (Username, Score, DateCompleted) values ("anonymous", 10000, '	2008-11-11 13:23:44');

select * from Leaderboard;
-- Leaderboard section END
