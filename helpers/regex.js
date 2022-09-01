

const regex = /(-|)rating:(safe|questionable|explicit)/gm;
let safety = {
    "safe":"safe",
    "questionable":"sketchy",
    "explicit":"unsafe"
}

export function rating(query){
    let m;
    if((m = regex.exec(query)) !== null){
        m.index === regex.lastIndex ? regex.lastIndex++ : ""
        return `${m[1]!=null ? m[1]: ""}rating:${safety[m[2]]}`;
    }
    return null;
}