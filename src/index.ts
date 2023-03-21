/// <reference path="../node_modules/@itfin/community-apps/types/index.d.ts" />
import { DateTime } from 'luxon';
import TalentLyftApi from './talentlyft-api';
import slug from './slug';

const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
const app = ITFinApp.createCommunityApp();

type AppConfig = ITFinAppConfigReturn & {
    accessToken: string;
    emailDomain: string;
};

type TalentLyftCandidate = {
    Skills: string[],
    Tags: string[],
    PhoneNumbers: Array<{ Id: number, Value: string, Type: string }>,
    SocialNetworks: Array<{ Id: number, Value: string, Type: string }>,
    PossibleDuplicates: boolean,
    Id: number,
    FirstName: string,
    LastName: string,
    Name: string,
    Title: string | null,
    Avatar: string | null,
    Company: string | null,
    Created: string,
    Location: { Id: number, Country: string, CountryCode: string } | null,
    Applications: any,
    Emails: Array<{ Id: number, Value: string, Type: string }>,
    Uid: string,
    SnoozedUntil: string | null,
    Url: string
};

type TalentLyftPayload = {
    Type: string,
    Data: TalentLyftCandidate
};

type TalentLyftResponse = {
    Topic: string
    Payload: TalentLyftPayload[];
};

export async function onInstall(config: AppConfig) {
    if (!DOMAIN_REGEX.test(config.emailDomain)) {
        throw new Error('Invalid email domain');
    }
    const companyId = app.getCompanyId();
    const incomingWebhookUrl = app.getIncomingWebhookUrl();
    const api = new TalentLyftApi(config.accessToken);
    await api.createSubscription(companyId, incomingWebhookUrl, ['candidate.hired']);
}

export async function onIncomingEvent(name:string, params: TalentLyftResponse) {
    const config:AppConfig = <AppConfig>app.getAppConfig();
    switch (params.Topic) {
        case 'candidate.hired':
            const candidatePayload = params.Payload.find(p => p.Type === 'Candidate');
            if (!candidatePayload) {
                return;
            }
            const candidate = candidatePayload.Data;
            const employee = {
                FirstName: candidate.FirstName,
                LastName: candidate.LastName,
                NativeName: candidate.Name,
                PersonalEmail: candidate.Emails[0] && candidate.Emails[0].Value,
                Email: '',
                Status: 'Active',
                DateOfEmployment: DateTime.utc().toFormat('yyyy-MM-dd'),
                Country: (candidate.Location && candidate.Location.Country) || '-',
                LocationCountry: (candidate.Location && candidate.Location.Country) || '-',
                CandidateUrl: candidate.Url
            };
            employee.Email = slug(`${employee.FirstName}-${employee.LastName}`).toLowerCase() + `@${config.emailDomain}`;
            await ITFinRequest.post('/api/v1/employees', employee, { signed: true });
    }
}
