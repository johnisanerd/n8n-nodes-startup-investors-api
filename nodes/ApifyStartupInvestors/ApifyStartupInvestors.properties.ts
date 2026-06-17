import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * Split a comma-separated string into a trimmed array, or return [] when empty.
 */
function toList(value: string): string[] {
	return (value || '')
		.split(',')
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
}

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs are sent; the Output / Fields parameters shape the
 * data we return, they are not part of the Actor input. Optional fields are only
 * sent when the user provides a value so the Actor keeps its own defaults.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	const input: Record<string, any> = {
		...defaultInput,
		Max_Results: context.getNodeParameter('Max_Results', itemIndex),
		Order_By: context.getNodeParameter('Order_By', itemIndex),
		Order_Direction: context.getNodeParameter('Order_Direction', itemIndex),
		Include_Contacts: context.getNodeParameter('Include_Contacts', itemIndex),
	};

	const keyword = context.getNodeParameter('Keyword', itemIndex, '') as string;
	const firmTypes = toList(context.getNodeParameter('Firm_Types', itemIndex, '') as string);
	const focusAreas = toList(context.getNodeParameter('Focus_Areas', itemIndex, '') as string);
	const stages = toList(context.getNodeParameter('Investment_Stages', itemIndex, '') as string);
	const countries = toList(context.getNodeParameter('Countries', itemIndex, '') as string);

	if (keyword) input.Keyword = keyword;
	if (firmTypes.length) input.Firm_Types = firmTypes;
	if (focusAreas.length) input.Focus_Areas = focusAreas;
	if (stages.length) input.Investment_Stages = stages;
	if (countries.length) input.Countries = countries;

	return input;
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Investor',
				value: 'investor',
			},
		],
		default: 'investor',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['investor'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search investor firms',
				description: 'Search investor firms and return one item per firm',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Keyword',
		name: 'Keyword',
		type: 'string',
		default: '',
		placeholder: 'e.g. fintech',
		description: 'Free-text keyword to match firm names and descriptions',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
	{
		displayName: 'Firm Types',
		name: 'Firm_Types',
		type: 'string',
		default: '',
		placeholder: 'e.g. Angel Investor, Venture Capital',
		description: 'Comma-separated firm types to filter by',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
	{
		displayName: 'Focus Areas',
		name: 'Focus_Areas',
		type: 'string',
		default: '',
		placeholder: 'e.g. Health Care, Software',
		description: 'Comma-separated industries or focus areas to filter by',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
	{
		displayName: 'Investment Stages',
		name: 'Investment_Stages',
		type: 'string',
		default: '',
		placeholder: 'e.g. Seed, Series A',
		description: 'Comma-separated investment stages to filter by',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
	{
		displayName: 'Countries',
		name: 'Countries',
		type: 'string',
		default: '',
		placeholder: 'e.g. United States, United Kingdom',
		description: 'Comma-separated countries to filter by',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Results',
		name: 'Max_Results',
		type: 'number',
		default: 100,
		typeOptions: { minValue: 1 },
		description: 'How many firms to return',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
	{
		displayName: 'Include Investor Contacts',
		name: 'Include_Contacts',
		type: 'boolean',
		default: false,
		description: 'Whether to include investor contact details (billed separately)',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
	{
		displayName: 'Order By',
		name: 'Order_By',
		type: 'options',
		options: [
			{ name: 'Created At', value: 'created_at' },
			{ name: 'Firm Country', value: 'firm_country' },
			{ name: 'Firm Name', value: 'firm_name' },
			{ name: 'Firm Type', value: 'firm_type_id' },
		],
		default: 'created_at',
		description: 'Field to sort the results by',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
	{
		displayName: 'Order Direction',
		name: 'Order_Direction',
		type: 'options',
		options: [
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		default: 'desc',
		description: 'Sort direction',
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['investor'], operation: ['search'] } },
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each firm',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful firm fields',
			},
		],
		default: 'simplified',
		description: 'How much data to return for each firm',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: { resource: ['investor'], operation: ['search'], output: ['selected'] },
		},
		options: [
			{ name: 'AUM', value: 'firm_aum' },
			{ name: 'Created At', value: 'created_at' },
			{ name: 'Crunchbase URL', value: 'crunchbase_url' },
			{ name: 'Description', value: 'firm_description' },
			{ name: 'Firm ID', value: 'firm_id' },
			{ name: 'Firm Name', value: 'firm_name' },
			{ name: 'Firm Type ID', value: 'firm_type_id' },
			{ name: 'Focus', value: 'firm_focus' },
			{ name: 'Industry Names', value: 'industry_names' },
			{ name: 'Last Checked', value: 'last_checked' },
			{ name: 'Stages', value: 'firm_stages' },
			{ name: 'Updated At', value: 'updated_at' },
			{ name: 'Website', value: 'firm_website' },
		],
		default: ['firm_name', 'firm_website', 'firm_focus', 'firm_stages'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
