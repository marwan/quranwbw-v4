<div align="center">
  <a target="_blank" href="[https://quranwbw.com](https://svelte.quranwbw.com)"><img src="https://raw.githubusercontent.com/marwan/quranwbw-svelte/main/public/images/logo.png" width="300"></a>
</div>

# About

I'm currently learning [Svelte](https://svelte.dev/) and what better way to do so by re-making [QuranWBW.com](https://quranwbw.com).

Checkout the live website at [svelte.quranwbw.com](https://svelte.quranwbw.com).

# Stack

[Svelte](https://svelte.dev/) + [Tailwind CSS](https://tailwindcss.com/).

# API

![Hits](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.quranwbw.com%2Fv1%2Fhits&query=%24.button&label=Hits)

I am using a custom API which I've made for this new version of QuranWBW — [api.quranwbw.com](https://api.quranwbw.com).

The current live version of QuranWBW uses static JSON files, which is fine, until it isn't.

Having a custom API enables me to fetch verses on demand, and allows the website to have pages like [Supplications From Quran](https://svelte.quranwbw.com/supplications) or [Bookmarks](https://svelte.quranwbw.com/bookmarks).

I have not yet restricted the usage of this API on other domains/hosts, but will do that once the new website goes live.

Scrapping is strictly not allowed. If you want to use this API on your website/app for development, please contact me via [email](mailto:quranwbw@gmail.com) first.

Following are some examples, however do note that these can change or break anytime:

| **Link**                                                             	| **Description**                                            	| **Notes**                                                                                                                                    	|
|----------------------------------------------------------------------	|------------------------------------------------------------	|----------------------------------------------------------------------------------------------------------------------------------------------	|
| https://api.quranwbw.com/v1/translations                             	| view all available word and verse translations             	| please note, verse translation IDs are not in continuous order                                                                               	|
| https://api.quranwbw.com/v1/verses?verses=1:1                        	| get verse 1:1                                              	| if not specified, the word translation will default to ID 1 (English) and word type will default to ID 1 (Uthmani Hafs)                      	|
| https://api.quranwbw.com/v1/verses?verses=1:1&word_type=2            	| get verse 1:1 with Naskh Nastaleeq IndoPak word type       	| ID 1 = Uthmani Hafs, ID 2 = Naskh Nastaleeq IndoPak                                                                                          	|
| https://api.quranwbw.com/v1/verses?verses=1:1&word_translation=2     	| get verse 1:1 with word translation of ID 2                	| checkout the /v1/translations endpoint to know which ID is for which word translation                                                        	|
| https://api.quranwbw.com/v1/verses?verses=1:1&verse_translation=1,15 	| get verse 1:1 with verse translations of ID 1 & 15         	| checkout the /v1/translations endpoint to know which ID is for which verse translation                                                       	|
| https://api.quranwbw.com/v1/verses?verses=1:1,1:7&between=true       	| get all verses between 1:1 and 1:7                         	| adding the `between=true` parameter will fetch all the verses in between the first and second key, as long as they are from the same chapter 	|
| https://api.quranwbw.com/v1/verses?verses=2:255,18:10                	| get verses 2:255 and 18:10                                 	| adding the `between=false` parameter (or not adding it at all) will only fetch the mentioned keys, even if they are from different chapters  	|
| https://api.quranwbw.com/v1/chapter?chapter=1&word_type=1            	| get complete chapter 1 verses with Uthmani Hafs word type  	| in case the word by word data is not required, this endpoint can be used to get complete verses (joined words)                               	|

# Contribution

You are free to add/suggest features, remove/report bugs, or just use the website in general.
