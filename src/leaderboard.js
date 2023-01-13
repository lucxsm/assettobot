const { Discord, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const pkg = require('jsdom');
const utils = require('./utils.js');

const {JSDOM} = pkg;

const CAR_NAME_MAPPING = {
    'ktyu_c8_lav_s1': 'C8 Laviolette Shuto Spec',
    'nissan_skyline_r34_omori_factory_s1': 'Skyline GT-R R34 Nismo Omori Factory S1',
    'srp_honda_s2000_legendary': 'S2000 (AP2 - Legendary)',
    'fgg_mitsubishi_evo_5_wangan': 'Lancer Evolution V Wangan Spec',
    'gmp_abflug_s900': 'ABflug S900 (JZA80)',
    'ddm_toyota_mr2_sw20_shuto': 'MR2 Shutoko-Spec',
    'ktyu_honda_nsx_ks': 'NSX Ktyu Spec',
    'nissan_skyline_r34_v-specperformance': 'Skyline GT-R R34 V-SPEC Performance',
    'amy_honda_ek9_turbo': 'Civic Type R (EK9) Turbo ver. 2',
    'ks_toyota_supra_mkiv_tuned': 'Supra MKIV Time Attack',
    'arch_ruf_ctr_1987': 'CTR-1 Yellowbird',
    'ddm_nissan_skyline_hr31_house': 'Skyline HR31 House-Spec',
    'srp_wangan_r33_ver1': 'Nissan Skyline GTR R33 (S3 - Wangan)'
}

const MEDAL_MAPPING = {
    0: ':first_place:',
    1: ':second_place:',
    2: ':third_place:'
}


module.exports = async (strackerUrl, description, name) => {
    let htmlString
    if (description.startsWith('Monthly')) {
        const date = new Date().toISOString().slice(0, 8) + '01'
        strackerUrl = utils.replaceQueryParam(strackerUrl, 'date_from', date)
        strackerUrl = utils.replaceQueryParam(strackerUrl, 'date_to', '')
    }

    try {
        const response = await fetch(strackerUrl)
        if (response.status !== 200) {
            console.error("Website did not respond with status code OK")
            return unavailableMessage(description, strackerUrl, name)
        }

        htmlString = await response.text()
    } catch (error) {
        console.error('An error occurred while trying to get the stracker page', error)
        return unavailableMessage(description, strackerUrl, name)
    }

    const leaderboardData = parseStrackerHtml(htmlString).map(lbe => {
        const adjustedStrackerUrl = utils.replaceQueryParam(
            utils.replaceQueryParam(strackerUrl, 'cars', lbe.vehicle),
            'ranking',
            1
        )

        return {
            request: () => fetch(adjustedStrackerUrl),
            vehicle: lbe.vehicle,
            time: lbe.time,
            player: utils.clean(lbe.player)
        }
    })

    let fields = []

    for (const lbd of leaderboardData) {
        await setTimeout(() => '', 750)
        const response = await lbd.request()
        if (response.status !== 200) {
            console.error(`Leaderboard entries for vehicle: ${lbd.vehicle} did not respond with status code OK`)
            console.error(`response: `, response)
            fields = [...fields, {
                name: CAR_NAME_MAPPING[lbd.vehicle] || lbd.vehicle,
                value: `${MEDAL_MAPPING[0]} \`${lbd.time}\` by ${utils.clean(lbe.player)}`
            }]
            return
        }

        const htmlString = await response.text()
        fields = [...fields, {
            name: CAR_NAME_MAPPING[lbd.vehicle] || lbd.vehicle,
            value: parseStrackerHtml(htmlString)
                .slice(0, 3)
                .map((lbe, index) => `${MEDAL_MAPPING[index]} \`${lbe.time}\` by ${utils.clean(lbe.player)}`)
                .join('\n')
        }]
    }

    let finalFields = []
    if (fields.length < 1) {
        finalFields = [{
            name: 'No times have been set so far!',
            value: 'Be the first one to set a time to be displayed here!'
        }]
    } else {
        fields.forEach((field, index) => {
            if (index + 1 < fields.length) {
                finalFields.push({...field, value: `${field.value}\n\u200b`})
            } else {
                finalFields.push(field)
            }
        })
    }

    return new EmbedBuilder()
        .setColor('#c15f6e')
        .setTitle('Leaderboard Link')
        .setDescription(description)
        .setURL(strackerUrl)
        .setThumbnail('https://cdn.discordapp.com/attachments/671487944250490902/832189834700652604/newlogob.png')
        .setAuthor({ name: name.startsWith('Leaderboard') ? name : 'Leaderboard: ' + name, iconURL: 'https://cdn.discordapp.com/attachments/1055890908761038900/1062129961881849986/al-klein.png', url: 'https://lucscripts.nl' })
        .addFields(finalFields)
        .setTimestamp()
}

const parseStrackerHtml = (htmlString) => {
    const dom = new JSDOM(htmlString)
    return [...dom.window.document.querySelector('tbody').childNodes]
        .filter(node => node.nodeName === 'TR')
        .map(node => ({
            vehicle: decodeHtml(node.children[2].innerHTML).trim(),
            player: decodeHtml(node.children[1].innerHTML),
            time: decodeHtml(node.children[3].innerHTML)
        }))
}

const decodeHtml = (html) => {
    const dom = new JSDOM('')
    const txt = dom.window.document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

const unavailableMessage = (description, strackerUrl, name) => {
    return new EmbedBuilder()
        .setColor('#c15f6e')
        .setTitle('Leaderboard Link')
        .setDescription(description)
        .setThumbnail('https://cdn.discordapp.com/attachments/671487944250490902/832189834700652604/newlogob.png')
        .setAuthor({ name: name.startsWith('Leaderboard') ? name : 'Leaderboard: ' + name, iconURL: 'https://cdn.discordapp.com/attachments/1055890908761038900/1062129961881849986/al-klein.png', url: 'https://lucscripts.nl' })
        .setURL(strackerUrl)
        .addField('Oh no', 'The leaderboard is currently unavailable. Try checking back again later')
        .setTimestamp()
}