import { SocialSentimentDetail } from "./socialsentimentdetail";

export interface SocialSentiment {
  reddit:SocialSentimentDetail[];
  symbol:string;
  twitter:SocialSentimentDetail[];
}
