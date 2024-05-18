<script>
	import { __currentPage } from '$utils/stores';
	import Logo from '$svgs/Logo.svelte';
</script>

<nav class="{$__currentPage === 'home' ? 'block' : 'hidden'} bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
	<div class="max-w-4xl flex flex-wrap items-center justify-between mx-auto py-4 px-8">
		<a href="https://flowbite.com/" class="flex items-center text-gray-500 space-x-3 rtl:space-x-reverse">
			<Logo width={32} />
		</a>
		<div class="flex">
			<button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-3xl md:hidden hover:bg-lightGray focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-lightGray dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
				<span class="sr-only">Open main menu</span>
				<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
				</svg>
			</button>
		</div>
		<div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
			<ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-3xl bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
				<li>
					<a href="#" class="block py-2 px-3 text-white bg-gray-700 rounded md:bg-transparent md:text-gray-700 md:p-0 md:dark:text-gray-500" aria-current="page">Home</a>
				</li>
				<li>
					<a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-lightGray md:hover:bg-transparent md:hover:text-gray-700 md:p-0 md:dark:hover:text-gray-500 dark:text-white dark:hover:bg-lightGray dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Supplications</a>
				</li>
				<li>
					<a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-lightGray md:hover:bg-transparent md:hover:text-gray-700 md:p-0 md:dark:hover:text-gray-500 dark:text-white dark:hover:bg-lightGray dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Bookmarks</a>
				</li>
				<li>
					<a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-lightGray md:hover:bg-transparent md:hover:text-gray-700 md:p-0 md:dark:hover:text-gray-500 dark:text-white dark:hover:bg-lightGray dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Morphology</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
