import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const today = moment();
const startOfYear = moment("2025-01-01");

const makeCommitDate = moment("2025-01-01");

const getRandomDate = () => {
    const randomDays = Math.floor(Math.random() * today.diff(startOfYear, "days") + 1);
    return moment(startOfYear).add(randomDays, "days");
};

const makeCommit = () => {
    const formattedDate = makeCommitDate.format();

    const data = { date: formattedDate };

    jsonfile.writeFile(path, data, () => {
        simpleGit().add([path]).commit(formattedDate, { "--date": formattedDate }).push();
    });
};

const makeCommitsRange = (n, usedDates = new Set()) => {
    if (n === 0) return simpleGit().push();

    let randomDate;
    do {
        randomDate = getRandomDate().format();
    } while (usedDates.has(randomDate)); // Ensure unique dates

    usedDates.add(randomDate);

    const data = { date: randomDate };

    jsonfile.writeFile(path, data, () => {
        simpleGit()
            .add([path])
            .commit(randomDate, { "--date": randomDate }, () => {
                makeCommitsRange(--n, usedDates);
            });
    });
};

const makeCommitsForEachDay = (currentDate = startOfYear) => {
    if (currentDate.isAfter(today)) return simpleGit().push();

    const formattedDate = currentDate.format();

    const data = { date: formattedDate };

    jsonfile.writeFile(path, data, () => {
        simpleGit()
            .add([path])
            .commit(formattedDate, { "--date": formattedDate }, () => {
                makeCommitsForEachDay(currentDate.add(1, "d"));
            });
    });
};

// Example usage
// makeCommit();
makeCommitsRange(100);
// makeCommitsForEachDay();
