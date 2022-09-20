


const postFields = [
    'canvasHeight',
    'canvasWidth',
    'checksum',
    'checksumMD5',
//    'commentCount',
//    'comments',
    'contentUrl',
    'creationTime',
    'favoriteCount',
    'fileSize',
    'flags',
    'hasCustomThumbnail',
    'id',
//    'lastEditTime',
//    'lastFeatureTime',
    'mimeType',
//    'noteCount',
//    'notes',
//    'pools',
    'relationCount',
//    'relations',
    'safety',
    'score',
    'source',
//    'tagCount',
    'tags',
    'thumbnailUrl',
    'type',
//    'user',
    'version'
]

export function setFields(mode = "all"){
    var ret = "";
    switch(mode){
        case "all":
            ret = postFields.join(',')
            break;
        default:
            ret = postFields.join(',')
            break;  
    }
    return ret;
}