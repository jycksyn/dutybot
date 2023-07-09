<script context="module" lang="ts">
	import { membersSchema, searchUsersSchema } from '$lib/forms';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { superForm, type SuperForm } from 'sveltekit-superforms/client';
	import type { SuperValidated, ZodValidation } from 'sveltekit-superforms/index';
	import { z } from 'zod';
	import Gravatar from './Gravatar.svelte';

	export interface ContainsUserSearchForm {
		userSearchForm: SuperValidated<typeof searchUsersSchema>;
		user: User;
	}
</script>

<script lang="ts">
	import type { User } from '@prisma/client';

	import type { UserSearchResult } from '$lib/usersearch';
	
	import {
		ChatBubbleBottomCenterText,
		Star,
		XMark
	} from '@steeze-ui/heroicons';

	import { Icon } from '@steeze-ui/svelte-icon';

	export let data: ContainsUserSearchForm;
	$: user = data.user;

	const {
		enhance,
		delayed,
		message: result,
		errors,
		form: values,
		constraints
	} = superForm<typeof searchUsersSchema, UserSearchResult>(data.userSearchForm, {
		validators: searchUsersSchema,
		dataType: 'json',
		invalidateAll: false
	});

	const userListPopup: PopupSettings = {
		event: 'focus-click',
		target: 'userListPopup',
		placement: 'bottom'
	};

	let ref: HTMLFormElement;
	let timeout: number;
	let waiting: boolean;

	const submitForm = () => {
		waiting = false;
		clearTimeout(timeout);
		if ($errors.email?.length) return;
		ref.requestSubmit();
	};

	const handleInput = () => {
		if ($errors.email?.length) return;
		waiting = true;
		clearTimeout(timeout);
		timeout = setTimeout(submitForm, 500);
	};

	const popups: { [key: string]: PopupSettings } = {
		respondent: {
			event: 'hover',
			target: 'popup-respondent',
			placement: 'bottom'
		},
		admin: {
			event: 'hover',
			target: 'popup-admin',
			placement: 'bottom'
		}
	};

	const basicSchema = z.object({
		members: membersSchema
	});

	type T = $$Generic<typeof basicSchema>;

	export let form: SuperForm<ZodValidation<T>, unknown>;

	$: parent = form.form;
	$: parentErrors = form.errors;

	const addMember = () => {
		if ($result?.user == undefined) return;
		const { name, email, id } = $result.user;
		if (!email) return;
		$parent.members = [
			...$parent.members,
			{
				name,
				email,
				is_respondent: true,
				is_admin: false,
				user_id: id
			}
		];
	};

	const removeMember = (i: number) => {
		const members = [...$parent.members];
		members.splice(i, 1);
		$parent.members = members;
	};
</script>

<form bind:this={ref} method="post" use:enhance action="?/usersearch">
	<label class="label flex flex-col items-stretch">
		<span>Members</span>
		<input
			on:input={handleInput}
			on:change={submitForm}
			placeholder="Add member email addresses..."
			use:popup={userListPopup}
			name="email"
			type="text"
			aria-invalid={$errors['email'] ? 'true' : undefined}
			bind:value={$values['email']}
			{...$constraints['email']}
			class="input"
		/>
	</label>
</form>

<dl class="list-dl">
	{#each $parent.members as member, i (member.email)}
		<div
			class="p-4 flex-wrap gap-4 [&>*]:!m-0"
		>
			<Gravatar email={member.email} />
			<span class="flex-auto">
				<dt>
					{member.name}
				</dt>
				<dd class="text-sm text-gray-500">{member.email}</dd>
			</span>
			<div class="flex flex-row gap-2">
				<label
					class="btn btn-sm -mr-4"
					class:variant-filled-primary={member.is_respondent}
				>
					<Icon class="h-4 mr-2" src={ChatBubbleBottomCenterText} />
					Respondent
					<input type="checkbox" class="hidden" bind:checked={$parent.members[i].is_respondent} />
				</label>
				<label
					class="btn btn-sm -mr-4"
					class:variant-filled-primary={member.is_admin}
					class:opacity-50={member.user_id == user.id}
				>
					<Icon class="h-4 mr-2" src={Star} />
					Admin
					<input type="checkbox" disabled={member.user_id == user.id} class="hidden" bind:checked={$parent.members[i].is_admin} />
				</label>
			</div>
			{#if member.user_id != user.id}
				<button type="button" class="btn-icon text-gray-500 h-6" on:click={() => removeMember(i)}>
					<Icon src={XMark} />
				</button>
			{/if}
		</div>
	{/each}
</dl>

{#each $parentErrors.members?._errors ?? [] as error}
	<small class="text-sm text-warning-600-300-token">{error}</small>
{/each}


<div class="relative">
	<div class="card z-10 p-2 w-full -mt-2 flex flex-column items-center" data-popup="userListPopup">
		{#if $errors?.email !== undefined || $values?.email == ''}
			<div class="p-2 text-error-600">{$errors?.email ?? 'Please enter an email'}</div>
		{:else if $delayed || waiting || !$result}
			<div class="placeholder h-10" />
		{:else if $result.user?.email == $values.email}
			<ul class="list">
				<li>
					<button type="button" on:click={addMember} class="list-option text-left w-full">
						<span><Gravatar class="h-10 w-10" email={$result.user.email} /></span>
						<div class="flex-auto flex flex-col">
							<span class="text-md">{$result.user.name}</span>
							<span class="text-sm text-gray-500">{$result.user.email}</span>
						</div>
					</button>
				</li>
			</ul>
		{:else if !$result.user}
			<div class="p-2 text-gray-600">No results found.</div>
		{/if}
	</div>
</div>
