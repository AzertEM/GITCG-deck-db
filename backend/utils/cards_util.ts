import axios from 'axios'

import gdb, { TcgActionCards, TcgCharacterCards } from '@genshin-db/tcg'
import {ActionCard, CharacterCard} from '../../types/card-types'

const getAllCharacterCards = () => {
    return gdb.tcgcharactercards("names", {
        matchCategories: true,
        verboseCategories: true,
    })
}

const getAllActionCards = () => {
    return gdb.tcgactioncards("names", {
        matchCategories: true,
        verboseCategories: true,
    })
}

function getImageUrl(filename: string) {
    filename = filename.replace(" ", "_");
    return `https://gi.yatta.moe/assets/UI/gcg/${filename}.png`;
}

export const convertCharacterCard = (character: TcgCharacterCards) => {
    const convertedCard: CharacterCard = {
        name: character.name,
        id: character.id,
        img_link: getImageUrl(character.images.filename_cardface)
    }
    return convertedCard
}

export const convertActionCard = (character: TcgActionCards) => {
    const convertedCard: ActionCard = {
        name: character.name,
        id: character.id,
        img_link: getImageUrl(character.images.filename_cardface)
    }
    return convertedCard
}

export const characterCards = getAllCharacterCards()
export const actionCards = getAllActionCards()

export const findCharacterCardByShareID = (id: number) => {
    return characterCards.find(card => card.shareid === id)
}

export const findActionCardByShareID = (id: number) => {
    return actionCards.find(card => card.shareid === id)
}

interface DeckShareID {
    deckcode: string,
    offset: number,
    cardshareids: number[]
}

const getDeckFromShareids = (deck: DeckShareID) => {
    let characters: CharacterCard[] = []
    let actions: ActionCard[] = []
    deck.cardshareids.forEach(shareID => {
        const character = findCharacterCardByShareID(shareID)
        const action = findActionCardByShareID(shareID)

        if (character != undefined) {
            characters.push(convertCharacterCard(character))
        } else if (action != undefined) {
            actions.push(convertActionCard(action))
        }
    })

    if (characters.length === 3 && actions.length === 30) {
        return {characters, actions}
    }
    else 
        return undefined
}

const URL = "https://genshin-db-api.vercel.app/api/"

export const decodeDeck = async (deckcode: string) => {
    const decodeLink = `${URL}tcgdeckshare/decode?code=${deckcode}`

    const response = await axios.get<DeckShareID>(decodeLink)
    return getDeckFromShareids(response.data)
}

