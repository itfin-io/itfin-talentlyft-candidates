const SUBSCRIPTIONS_URL = 'https://api.talentlyft.com/v2/subscriptions';

export default class TalentLyftApi {
    constructor(private accessToken:string) {
    }

    createSubscription(ownerId:number, url:string, topics:string[]) {
        ITFinRequest.post(
            SUBSCRIPTIONS_URL, {
                ServiceType: 'Web',
                Url: url,
                HubSecret: ownerId.toString(),
                Topics: topics
            }, {
                headers: {Authorization: `Bearer ${this.accessToken}`}
            });
    }
}
