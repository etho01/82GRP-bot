
const COMMANDS_DIR = '../commands';

export type Action = {
    name: string;
    label: string;
    description?: string;
    subActions?: Action[];
};

const ACTIONS_LIST: Action = 
{
    description: 'Liste des actions',
    name: '',
    label: '',
    subActions: [
        {
            'name' : 'front',
            'label' : 'Front',
            'description' : 'Front actions',
            'subActions' : [
                {
                    'name' : 'kill',
                    'label' : 'Kill',
                    'description' : 'Kill actions',
                    'subActions' : [
                        {
                            "name" : "galager",
                            "label" : "galager",
                            "description" : "Galager actions"
                        }
                    ]
                }
            ]
        },
        {
            'name' : 'logi',
            'label' : 'Logistique'
        },
        {
            'name' : 'faci',
            'label' : 'Facility'
        }
    ]
}


export { COMMANDS_DIR, ACTIONS_LIST };