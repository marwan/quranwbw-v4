<script>
	import { Link } from 'svelte-routing';
	import PageMeta from '$components/PageMeta.svelte';
	import { __currentPage } from '$utils/stores';
	import { linkElement } from '$data/commonStyles';

	__currentPage.set('about');
</script>

<PageMeta title={'About'} />

<div class="">
	<div class="my-6 space-y-4 pb-4">
		<!-- <h1 class="text-2xl">About</h1> -->
		<div class="text-sm">
			<div class="text-center text-md md:text-xl font-medium opacity-60 italic w-4/5 mx-auto">
				"Indeed, this (book) is a reminder, so he who wills may take to his Lord a way. And you do not will except that Allah wills. Indeed, Allah is ever Knowing and Wise."
				<Link to="/76/29-30" class={linkElement}>(76:29-30)</Link>
			</div>
			<br /><br />

			<i>In the name of Allah and prayers & blessings be upon His messenger, Muhammad (<span style="font-style: initial; font-weight: normal;">ﷺ</span>).</i>

			<br /><br />
			Quranwbw.com is a Quran website with word by word translation, transliteration and corpus in multiple languages. You can also listen to how a word is pronounced and also listen to verse recitations.

			<br /><br />
			Quranwbw.com wouldn't be possible without these amazing people:

			<br /><br />
			<ul class="list-disc ml-5 space-y-2">
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="http://emuslim.com/Quran/Translation_English.asp">Dr. Shehnaz Shaikh, Ms. Kausar Khatri</a> for their English and <a class={linkElement} target="_blank" rel="noreferrer" href="https://www.farhathashmi.com">Dr. Farhat Hashmi</a> for her Urdu word by word compilation.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://quran.com">Quran.com</a> for their API.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="http://recitequran.com">ReciteQuran.com </a> for their word by word audio files orginally recited by <a class={linkElement} target="_blank" rel="noreferrer" href="https://www.almaghrib.org/instructors/wisam-sharieff/">Imam Wisam Sharieff</a>.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="http://qurancomplex.gov.sa/">King Fahd Glorious Quran Printing Complex</a> for their Quran text.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="http://tanzil.net/trans/">Tanzil.net</a> for their collection of Quranic resources.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="http://everyayah.com">EveryAyah.com</a>, <a class={linkElement} href="https://qurancentral.com">QuranCentral.com</a> and <a class={linkElement} href="https://quranicaudio.com">QuranicAudio.com</a> for their collection of Quranic audios.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://zoopernet.com">Ayman Siddiqui</a> for all the help including providing various website datas and fonts & website testing.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://github.com/cpfair">Collin Fair</a> for his word timestamps for Quranic audios.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://play.google.com/store/apps/details?id=com.atq.quranemajeedapp.org.islamone&hl=en">Usman Pervez (IslamOne android app)</a> for the Urdu words database.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://gtaf.org">Greentech Apps (Al Quran Tafsir & by Word app)</a> for their English, Indonesian & Bangla words and corpus database.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://www.typemybook.com/download/complete-quran-kareem-text/">Ata Rafi</a> for sharing the IndoPak text originally by <a class={linkElement} target="_blank" rel="noreferrer" href="http://inpage.com/">InPage™</a>.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://apps.apple.com/us/app/quran-word-by-word/id588198510">Azrul Azwar (Quran WbW iOS app)</a> for the words databases in many different languages.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="http://csalt.itu.edu.pk/urdufont/index.html">CSALT</a> for their Mehr Nastaliq Urdu font.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://www.alhudapk.com/products/hindi-section.html">Al-Huda International</a> for their Hindi word by word PDF files.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://www.quran411.com/">Quran411.com</a> for their English transliteration orginally by M.A.H. Eliyasee.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://www.soundvision.com/article/a-thematic-introduction-to-the-surahs-of-the-qur-an">SoundVision.com</a> for their thematic introduction to the surahs of the Quran.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="http://www.tamililquran.com/">TamililQuran.com</a> for their Tamil word by word database orginally by <a class={linkElement} target="_blank" rel="noreferrer" href="https://www.darulhuda.net/">Darul Huda</a>.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://alquran.cloud/">Al Quran Cloud</a> and <a class={linkElement} target="_blank" rel="noreferrer" href="https://github.com/fawazahmed0">Fawaz Ahmed</a> for their Quran translations API.</li>
				<li><a class={linkElement} target="_blank" rel="noreferrer" href="https://drusaman.github.io/">Dr. Usama Nonnenmacher</a> for his excellent work on the French word by word data.</li>
			</ul>

			<br /><br />
			Do note, this website is just a hobby project and is not being worked on full-time. If you'd like to report an issue, have any suggestions, or would like to contribute, please visit Quranwbw.com's <a class={linkElement} target="_blank" rel="noreferrer" href="https://github.com/marwan/quranwbw-v4">repo on GitHub</a>, or contact us on
			<a class={linkElement} href="mailto:contact@quranwbw.com">contact@quranwbw.com</a>.

			<br /><br />
			All the data used on this website belongs to their respective owners/authors and copying them is not allowed.
		</div>
	</div>
</div>
