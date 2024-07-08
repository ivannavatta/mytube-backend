export const ValidatePrivacy = (param: string): boolean => {
    let result;
    if(param === 'public') {
        result = false
        return result
    }
    else if(param === 'private') {
        result = true
        return result
    }
    result = false
    return result

}