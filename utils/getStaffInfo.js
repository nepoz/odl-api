const osmosis = require('osmosis')
const baseUrl = 'https://www.uttyler.edu/digital-learning/meet-the-staff'
const utBaseUrl = 'https://www.uttyler.edu'

/**
 * Scrapes basic info about each listed ODL staff member
 * Information scraped at this step:
 *      -name
 *      -number
 *      -office
 *      -email
 */
const scrapeStaff = () => {
    return new Promise((resolve, reject) => {
        //Object returned if promise is resolved
        let staffInfo = []

        //RegExps help pattern match offices and phone numbers
        const numbersRegExp = /((\(\d{3}\)?)|(\d{3}))([\s-./]?)(\d{3})([\s-./]?)(\d{4})/
        const officeRegExp = /[A-Z]{3} (\d{3}[A-Z]|\d{3}|\d{4})/

        osmosis
            .get(baseUrl)
            .find('.col-md-p > p')      //"parent > child" selector to fetch every <p> tag under div of class col-md-p
            .set({
                name : '.b',
                email: 'a',
            })
            .set('extra')               //All the information in the paragraph, will be cleaned up later to extract phone, office
            .data(data => {
                if (Object.keys(data).length === 3) staffInfo.push(data)      //Some p's contain images, ignoring those for now as can't match img to member
            })
            .error(err => reject(err))
            //Method entered if Promise resolved, cleans up data to send back
            .done(() => {
                staffInfo.forEach((entry) => {
                    const trimmedName = entry.name.split(',')[0]        //Remove degrees from names

                    const numMatchArray = entry.extra.match(numbersRegExp)
                    const num = numMatchArray ? numMatchArray[0] : null     //Add phone number if available
                   
                    const officeMatchArray = entry.extra.match(officeRegExp)
                    const office = officeMatchArray ? officeMatchArray[0] : 'LIB 127'       //Add office if available, default office is LIB 127
                   
                    //Final cleanup of returned object, no need for 'extra' field as all data cleaned up
                    entry.name = trimmedName
                    if(num) entry.number = num
                    entry.office = office
                    delete entry.extra
                })
                
                resolve(staffInfo)
            })
    })
}

/**
 * Collect images for every staff member.
 * Added to base Object returned by scrapeStaff() in a later step
 */
const scrapeImages = () => {
    return new Promise((resolve, reject) => {
        const images = []

        osmosis
            .get(baseUrl)
            .find('.col-md-p > p')
            .set({
                name: 'img@alt',        //Necessary to match image to staff member later
                src: 'img@src',         //Need path to allow Assistant to fetch image when constructing Basic Card
            })
            .data(data => {
                if (Object.keys(data).length == 2) images.push(data)
            })
            .error(err => reject(err))
            .done(() => {
                images.forEach(elem => {
                    elem.img = utBaseUrl + elem.img         //Modifying src url as image not hosted on ODL server
                })
                resolve(images)
            })
    })
}

/**
 * Combines staff info with images to provide complete scraper function
 * returns an array of Staff objects with all relevant information
 */
const getStaffInfo = async() => {
    const staff = await scrapeStaff()
    const images = await scrapeImages()

    images.forEach(img => {
        const firstName = img.name.split(' ')[0]

        const match = staff.find(member => member.name.includes(firstName))
        if (match) match.image = utBaseUrl + img.src
    })

    return staff
}

module.exports = {
    getStaffInfo
}