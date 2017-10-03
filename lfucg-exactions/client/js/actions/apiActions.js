import {
  API_CALL,
} from '../constants/actionTypes';

import {
    ME,

    LOGIN,
    LOGOUT,

    GET_SUBDIVISIONS,
    GET_SUBDIVISION_ID,
    GET_SUBDIVISION_QUERY,
    POST_SUBDIVISION,
    PUT_SUBDIVISION,

    GET_PLATS,
    GET_PLAT_ID,
    GET_PLAT_QUERY,
    GET_SUBDIVISION_PLATS,
    POST_PLAT,
    PUT_PLAT,

    POST_PLAT_ZONE,
    PUT_PLAT_ZONE,
    PUT_PLAT_ZONE_DUES,

    GET_LOTS,
    GET_LOT_ID,
    GET_LOT_QUERY,
    GET_PLAT_LOTS,
    POST_LOT,
    PUT_LOT,
    PUT_PERMIT_ID_ON_LOT,

    GET_ACCOUNTS,
    GET_ACCOUNT_ID,
    GET_LFUCG_ACCOUNT,
    GET_ACCOUNT_QUERY,
    POST_ACCOUNT,
    PUT_ACCOUNT,

    GET_NOTE_CONTENT,
    POST_NOTE,

    GET_UPLOAD_CONTENT,
    POST_UPLOAD,

    GET_AGREEMENTS,
    GET_AGREEMENT_ID,
    GET_AGREEMENT_QUERY,
    GET_ACCOUNT_AGREEMENTS,
    POST_AGREEMENT,
    PUT_AGREEMENT,

    GET_PAYMENTS,
    GET_PAYMENT_ID,
    GET_PAYMENT_QUERY,
    GET_LOT_PAYMENTS,
    GET_ACCOUNT_PAYMENTS,
    GET_AGREEMENT_PAYMENTS,
    POST_PAYMENT,
    PUT_PAYMENT,

    GET_PROJECTS,
    GET_PROJECT_ID,
    GET_PROJECT_QUERY,
    GET_AGREEMENT_PROJECTS,
    POST_PROJECT,
    PUT_PROJECT,

    GET_PROJECT_COSTS,
    GET_PROJECT_COST_ID,
    GET_PROJECT_COST_QUERY,
    GET_PROJECT_PROJECT_COSTS,
    POST_PROJECT_COST,
    PUT_PROJECT_COST,

    GET_ACCOUNT_LEDGERS,
    GET_ACCOUNT_LEDGER_ID,
    GET_ACCOUNT_LEDGER_QUERY,
    GET_LOT_ACCOUNT_LEDGERS,
    GET_ACCOUNT_ACCOUNT_LEDGERS,
    GET_AGREEMENT_ACCOUNT_LEDGERS,
    POST_ACCOUNT_LEDGER,
    PUT_ACCOUNT_LEDGER,

    GET_PAGINATION,

} from '../constants/apiConstants';

export function getMe() {
    return {
        type: API_CALL,
        endpoint: ME,
        url: '/me',
    };
}

// LOGIN RELATED
export function login() {
    return {
        type: API_CALL,
        endpoint: LOGIN,
        url: '/login/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                username,
                password,
            } = activeForm;
            return {
                username,
                password,
            };
        },
    };
}

export function logout() {
    return {
        type: API_CALL,
        endpoint: LOGOUT,
        url: '/delete_token/',
        method: 'POST',
    };
}

// SUBDIVISIONS
export function getSubdivisions() {
    return {
        type: API_CALL,
        endpoint: GET_SUBDIVISIONS,
        url: '/subdivision/',
    };
}

export function getSubdivisionID(selectedSubdivision) {
    return {
        type: API_CALL,
        endpoint: GET_SUBDIVISION_ID,
        url: `/subdivision/${selectedSubdivision}`,
    };
}

export function getSubdivisionQuery() {
    return {
        type: API_CALL,
        endpoint: GET_SUBDIVISION_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/subdivision/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function postSubdivision() {
    return {
        type: API_CALL,
        endpoint: POST_SUBDIVISION,
        url: '/subdivision/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                name,
                gross_acreage,
            } = activeForm;
            return {
                name,
                gross_acreage,
            };
        },
    };
}

export function putSubdivision(selectedSubdivision) {
    return {
        type: API_CALL,
        endpoint: PUT_SUBDIVISION,
        url: `/subdivision/${selectedSubdivision}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                name,
                gross_acreage,
            } = activeForm;
            return {
                name,
                gross_acreage,
            };
        },
    };
}

// PLATS
export function getPlats() {
    return {
        type: API_CALL,
        endpoint: GET_PLATS,
        url: '/plat/',
    };
}

export function getPlatID(selectedPlat) {
    return {
        type: API_CALL,
        endpoint: GET_PLAT_ID,
        url: `/plat/${selectedPlat}`,
    };
}

export function getPlatQuery() {
    return {
        type: API_CALL,
        endpoint: GET_PLAT_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/plat/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function getSubdivisionPlats(selectedSubdivision) {
    return {
        type: API_CALL,
        endpoint: GET_SUBDIVISION_PLATS,
        url: `/plat/?subdivision=${selectedSubdivision}`,
    };
}

export function postPlat() {
    return {
        type: API_CALL,
        endpoint: POST_PLAT,
        url: '/plat/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                subdivision,
                name,
                date_recorded,
                total_acreage,
                latitude,
                longitude,
                plat_type,
                expansion_area,
                unit,
                section,
                block,
                buildable_lots,
                non_buildable_lots,
                cabinet,
                slide,
                calculation_note,
                sewer_due,
                non_sewer_due,
                account,
            } = activeForm;
            return {
                name,
                subdivision,
                date_recorded,
                total_acreage,
                latitude,
                longitude,
                plat_type,
                expansion_area,
                unit,
                section,
                block,
                buildable_lots,
                non_buildable_lots,
                cabinet,
                slide,
                calculation_note,
                sewer_due,
                non_sewer_due,
                account,
            };
        },
    };
}

export function putPlat(selectedPlat) {
    return {
        type: API_CALL,
        endpoint: PUT_PLAT,
        url: `/plat/${selectedPlat}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                subdivision,
                name,
                date_recorded,
                total_acreage,
                latitude,
                longitude,
                plat_type,
                expansion_area,
                unit,
                section,
                block,
                buildable_lots,
                non_buildable_lots,
                cabinet,
                slide,
                calculation_note,
                sewer_due,
                non_sewer_due,
                account,
            } = activeForm;
            return {
                name,
                subdivision,
                date_recorded,
                total_acreage,
                latitude,
                longitude,
                plat_type,
                expansion_area,
                unit,
                section,
                block,
                buildable_lots,
                non_buildable_lots,
                cabinet,
                slide,
                calculation_note,
                sewer_due,
                non_sewer_due,
                account,
            };
        },
    };
}

// PLAT_ZONES
export function postPlatZone() {
    return {
        type: API_CALL,
        endpoint: POST_PLAT_ZONE,
        url: '/platZone/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                plat,
                zone,
                acres,
            } = activeForm;
            return {
                plat,
                zone,
                acres,
            };
        },
    };
}

export function putPlatZone(selectedPlatZone, zone, acres) {
    return {
        type: API_CALL,
        endpoint: PUT_PLAT_ZONE,
        url: `/platZone/${selectedPlatZone}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                plat,
            } = activeForm;
            return {
                plat,
                zone,
                acres,
            };
        },
    };
}

export function putPlatZoneDues(
    selectedPlatZone,
    zone,
    acres,
    dues_roads,
    dues_open_spaces,
    dues_sewer_cap,
    dues_sewer_trans,
    dues_parks,
    dues_storm_water,
) {
    return {
        type: API_CALL,
        endpoint: PUT_PLAT_ZONE_DUES,
        url: `/platZone/${selectedPlatZone}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                plat,
            } = activeForm;
            return {
                plat,
                zone,
                acres,
                dues_roads,
                dues_open_spaces,
                dues_sewer_cap,
                dues_sewer_trans,
                dues_parks,
                dues_storm_water,
            };
        },
    };
}

// LOTS
export function getLots() {
    return {
        type: API_CALL,
        endpoint: GET_LOTS,
        url: '/lot/',
    };
}

export function getLotID(selectedLot) {
    return {
        type: API_CALL,
        endpoint: GET_LOT_ID,
        url: `/lot/${selectedLot}`,
    };
}

export function getLotQuery() {
    return {
        type: API_CALL,
        endpoint: GET_LOT_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/lot/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function getPlatLots(selectedPlat) {
    return {
        type: API_CALL,
        endpoint: GET_PLAT_LOTS,
        url: `/lot/?plat=${selectedPlat}`,
    };
}

export function postLot() {
    return {
        type: API_CALL,
        endpoint: POST_LOT,
        url: '/lot/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                plat,
                parcel_id,
                lot_number,
                permit_id,
                latitude,
                longitude,
                address_number,
                address_direction,
                address_street,
                address_suffix,
                address_unit,
                address_city,
                address_state,
                address_zip,
                dues_roads_dev,
                dues_roads_own,
                dues_sewer_trans_dev,
                dues_sewer_trans_own,
                dues_sewer_cap_dev,
                dues_sewer_cap_own,
                dues_parks_dev,
                dues_parks_own,
                dues_storm_dev,
                dues_storm_own,
                dues_open_space_dev,
                dues_open_space_own,
                account,
            } = activeForm;
            return {
                plat,
                parcel_id,
                lot_number,
                permit_id,
                latitude,
                longitude,
                address_number,
                address_direction,
                address_street,
                address_suffix,
                address_unit,
                address_city,
                address_state,
                address_zip,
                address_full: `${address_number} ${address_direction ? address_direction : ''} ${address_street} ${address_suffix ? address_suffix : ''} ${address_unit ? address_unit : ''}, Lexington, KY ${address_zip}`,
                dues_roads_dev,
                dues_roads_own,
                dues_sewer_trans_dev,
                dues_sewer_trans_own,
                dues_sewer_cap_dev,
                dues_sewer_cap_own,
                dues_parks_dev,
                dues_parks_own,
                dues_storm_dev,
                dues_storm_own,
                dues_open_space_dev,
                dues_open_space_own,
                account,
            };
        },
    };
}

export function putLot(selectedLot) {
    return {
        type: API_CALL,
        endpoint: PUT_LOT,
        url: `/lot/${selectedLot}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                plat,
                parcel_id,
                lot_number,
                permit_id,
                latitude,
                longitude,
                address_number,
                address_direction,
                address_street,
                address_suffix,
                address_unit,
                address_city,
                address_state,
                address_zip,
                dues_roads_dev,
                dues_roads_own,
                dues_sewer_trans_dev,
                dues_sewer_trans_own,
                dues_sewer_cap_dev,
                dues_sewer_cap_own,
                dues_parks_dev,
                dues_parks_own,
                dues_storm_dev,
                dues_storm_own,
                dues_open_space_dev,
                dues_open_space_own,
                account,
                // payment,
            } = activeForm;
            return {
                plat,
                parcel_id,
                lot_number,
                permit_id,
                latitude,
                longitude,
                address_number,
                address_direction,
                address_street,
                address_suffix,
                address_unit,
                address_city,
                address_state,
                address_zip,
                address_full: `${address_number} ${address_direction ? address_direction : ''} ${address_street} ${address_suffix ? address_suffix : ''} ${address_unit ? address_unit : ''}, Lexington, KY ${address_zip}`,
                dues_roads_dev,
                dues_roads_own,
                dues_sewer_trans_dev,
                dues_sewer_trans_own,
                dues_sewer_cap_dev,
                dues_sewer_cap_own,
                dues_parks_dev,
                dues_parks_own,
                dues_storm_dev,
                dues_storm_own,
                dues_open_space_dev,
                dues_open_space_own,
                account,
                // payment,
            };
        },
    };
}

export function putPermitIdOnLot(selectedLot) {
    return {
        type: API_CALL,
        endpoint: PUT_PERMIT_ID_ON_LOT,
        url: `/lot/${selectedLot}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                permit_id,
            } = activeForm;
            return {
                permit_id,
            };
        },
    };
}

// NOTES
export function getNoteContent() {
    return {
        type: API_CALL,
        endpoint: GET_NOTE_CONTENT,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                content_type,
                object_id,
                parent_content_type,
                parent_object_id,
            } = activeForm;

            const related_notes = parent_content_type ? `/note/?content_type=${content_type}&object_id=${object_id}&parent_content_type=${parent_content_type}&parent_object_id=${parent_object_id}` : `/note/?content_type=${content_type}&object_id=${object_id}`;
            return related_notes;
        },
    };
}

export function postNote() {
    return {
        type: API_CALL,
        endpoint: POST_NOTE,
        url: '/note/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
                currentUser,
            } = getState();
            const {
                note,
                content_type,
                object_id,
            } = activeForm;
            const {
                id,
            } = currentUser;
            return {
                user: id,
                note,
                content_type,
                object_id,
            };
        },
    };
}

// UPLOADS
export function getUploadContent() {
    return {
        type: API_CALL,
        endpoint: GET_UPLOAD_CONTENT,
        url: '/upload/',
    };
}
// export function getUploadContent() {
//     return {
//         type: API_CALL,
//         endpoint: GET_UPLOAD_CONTENT,
//         url: (getState) => {
//             const {
//                 activeForm,
//             } = getState();
//             const {
//                 file_content_type,
//                 file_object_id,
//             } = activeForm;
//             console.log('ACTION ACTIVE FORM', activeForm);

//             return `/upload/?file_content_type=${file_content_type}&file_object_id=${file_object_id}`;
//         },
//     };
// }

export function postUpload() {
    return {
        type: API_CALL,
        endpoint: POST_UPLOAD,
        // url: '/upload/',
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                upload,
            } = activeForm;
            const upload_index = upload.lastIndexOf('\\') + 1;
            return `/upload/${upload.slice(upload_index, upload.length)}`;
        },
        headers: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                upload,
            } = activeForm;
            const upload_index = upload.lastIndexOf('\\') + 1;

            let stored_token;
            try {
                stored_token = localStorage.getItem('Token');
            } catch (e) {
                const index_token = document.cookie.indexOf('Token=');
                if (index_token) {
                    const semicolon = index_token + 5 + document.cookie.substring(index_token).indexOf(';');
                    stored_token = document.cookie.substring(index_token, semicolon);
                } else {
                    stored_token = null;
                }
            }

            const authorization = global.Authorization ? global.Authorization : stored_token;
            return {
                'X-CSRFToken': global.CSRFToken,
                Authorization: `Token ${authorization}`,
                filename: upload.slice(upload_index, upload.length),
                'Content-Disposition': `attachment; filename=${upload}`,
                'Content-Type': undefined,
                enctype: 'multipart/form-data',
            };
        },
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
                currentUser,
            } = getState();
            const {
                upload,
                file_content_type,
                file_object_id,
            } = activeForm;
            const {
                id,
            } = currentUser;
            const upload_index = upload.lastIndexOf('\\') + 1;
            const upload_file = document.getElementById('upload').files[0];
            const formData = new FormData();
            formData.append('upload', upload_file);
            // formData.append(
                // upload,
            //     file_content_type,
            //     file_object_id,
            // );
            console.log('UPLOAD FILE', upload_file);
            console.log('UPLOAD', upload);
            // console.log('CONTENT TYPE', file_content_type);
            return {
                user: id,
                formData,
                // filename: upload,
                // upload: upload_file,
                // upload: upload.slice(upload_index, upload.length),
                // file_content_type,
                // file_object_id,
                // transformRequest: formData,
            };
        },
    };
}

// ACCOUNTS
export function getAccounts() {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNTS,
        url: '/account/',
    };
}

export function getAccountID(selectedAccount) {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNT_ID,
        url: `/account/${selectedAccount}`,
    };
}

export function getLFUCGAccount() {
    return {
        type: API_CALL,
        endpoint: GET_LFUCG_ACCOUNT,
        url: '/account/?search=LFUCG',
    };
}

export function getAccountQuery() {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNT_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/account/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function postAccount() {
    return {
        type: API_CALL,
        endpoint: POST_ACCOUNT,
        url: '/account/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                account_name,
                contact_first_name,
                contact_last_name,
                address_number,
                address_street,
                address_city,
                address_state,
                address_zip,
                phone,
                email,
            } = activeForm;
            return {
                account_name,
                contact_first_name,
                contact_last_name,
                contact_full_name: `${contact_first_name} ${contact_last_name}`,
                address_number,
                address_street,
                address_city,
                address_state,
                address_zip,
                address_full: `${address_number} ${address_street}, ${address_city}, ${address_state} ${address_zip}`,
                phone,
                email,
            };
        },
    };
}

export function putAccount(selectedAccount) {
    return {
        type: API_CALL,
        endpoint: PUT_ACCOUNT,
        url: `/account/${selectedAccount}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                account_name,
                contact_first_name,
                contact_last_name,
                address_number,
                address_street,
                address_city,
                address_state,
                address_zip,
                phone,
                email,
            } = activeForm;
            return {
                account_name,
                contact_first_name,
                contact_last_name,
                contact_full_name: `${contact_first_name} ${contact_last_name}`,
                address_number,
                address_street,
                address_city,
                address_state,
                address_zip,
                address_full: `${address_number} ${address_street}, ${address_city}, ${address_state} ${address_zip}`,
                phone,
                email,
            };
        },
    };
}

// AGREEMENTS
export function getAgreements() {
    return {
        type: API_CALL,
        endpoint: GET_AGREEMENTS,
        url: '/agreement/',
    };
}

export function getAgreementID(selectedAgreement) {
    return {
        type: API_CALL,
        endpoint: GET_AGREEMENT_ID,
        url: `/agreement/${selectedAgreement}`,
    };
}

export function getAgreementQuery() {
    return {
        type: API_CALL,
        endpoint: GET_AGREEMENT_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/agreement/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function getAccountAgreements(selectedAccount) {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNT_AGREEMENTS,
        url: `/agreement/?account_id=${selectedAccount}`,
    };
}

export function postAgreement() {
    return {
        type: API_CALL,
        endpoint: POST_AGREEMENT,
        url: '/agreement/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                account_id,
                resolution_number,
                expansion_area,
                agreement_type,
                date_executed,
            } = activeForm;
            return {
                account_id,
                resolution_number,
                expansion_area,
                agreement_type,
                date_executed,
            };
        },
    };
}

export function putAgreement(selectedAgreement) {
    return {
        type: API_CALL,
        endpoint: PUT_AGREEMENT,
        url: `/agreement/${selectedAgreement}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                account_id,
                resolution_number,
                expansion_area,
                agreement_type,
                date_executed,
            } = activeForm;
            return {
                account_id,
                resolution_number,
                expansion_area,
                agreement_type,
                date_executed,
            };
        },
    };
}

// PAYMENTS
export function getPayments() {
    return {
        type: API_CALL,
        endpoint: GET_PAYMENTS,
        url: '/payment/',
    };
}

export function getPaymentID(selectedPayment) {
    return {
        type: API_CALL,
        endpoint: GET_PAYMENT_ID,
        url: `/payment/${selectedPayment}`,
    };
}

export function getPaymentQuery() {
    return {
        type: API_CALL,
        endpoint: GET_PAYMENT_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/payment/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function getLotPayments(selectedLot) {
    return {
        type: API_CALL,
        endpoint: GET_LOT_PAYMENTS,
        url: `/payment/?lot_id=${selectedLot}`,
    };
}

export function getAccountPayments(selectedAccount) {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNT_PAYMENTS,
        url: `/payment/?credit_account=${selectedAccount}`,
    };
}

export function getAgreementPayments(selectedAgreement) {
    return {
        type: API_CALL,
        endpoint: GET_AGREEMENT_PAYMENTS,
        url: `/payment/?credit_source=${selectedAgreement}`,
    };
}

export function postPayment() {
    return {
        type: API_CALL,
        endpoint: POST_PAYMENT,
        url: '/payment/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                lot_id,
                paid_by,
                paid_by_type,
                payment_type,
                check_number,
                credit_source,
                credit_account,
                paid_roads,
                paid_sewer_trans,
                paid_sewer_cap,
                paid_parks,
                paid_storm,
                paid_open_space,
            } = activeForm;
            return {
                lot_id,
                paid_by,
                paid_by_type,
                payment_type,
                check_number,
                credit_source,
                credit_account,
                paid_roads,
                paid_sewer_trans,
                paid_sewer_cap,
                paid_parks,
                paid_storm,
                paid_open_space,
            };
        },
    };
}

export function putPayment(selectedPayment) {
    return {
        type: API_CALL,
        endpoint: PUT_PAYMENT,
        url: `/payment/${selectedPayment}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                lot_id,
                paid_by,
                paid_by_type,
                payment_type,
                check_number,
                credit_source,
                credit_account,
                paid_roads,
                paid_sewer_trans,
                paid_sewer_cap,
                paid_parks,
                paid_storm,
                paid_open_space,
            } = activeForm;
            return {
                lot_id,
                paid_by,
                paid_by_type,
                payment_type,
                check_number,
                credit_source,
                credit_account,
                paid_roads,
                paid_sewer_trans,
                paid_sewer_cap,
                paid_parks,
                paid_storm,
                paid_open_space,
            };
        },
    };
}

// PROJECTS
export function getProjects() {
    return {
        type: API_CALL,
        endpoint: GET_PROJECTS,
        url: '/project/',
    };
}

export function getProjectID(selectedProject) {
    return {
        type: API_CALL,
        endpoint: GET_PROJECT_ID,
        url: `/project/${selectedProject}`,
    };
}

export function getProjectQuery() {
    return {
        type: API_CALL,
        endpoint: GET_PROJECT_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/project/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function getAgreementProjects(selectedAgreement) {
    return {
        type: API_CALL,
        endpoint: GET_AGREEMENT_PROJECTS,
        url: `/project/?agreement_id=${selectedAgreement}`,
    };
}

export function postProject() {
    return {
        type: API_CALL,
        endpoint: POST_PROJECT,
        url: '/project/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                agreement_id,
                project_category,
                name,
                expansion_area,
                project_type,
                project_status,
                status_date,
                project_cost_estimates,
                project_description,
            } = activeForm;
            return {
                agreement_id,
                project_category,
                name,
                expansion_area,
                project_type,
                project_status,
                status_date,
                project_cost_estimates,
                project_description,
            };
        },
    };
}

export function putProject(selectedProject) {
    return {
        type: API_CALL,
        endpoint: PUT_PROJECT,
        url: `/project/${selectedProject}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                agreement_id,
                project_category,
                name,
                expansion_area,
                project_type,
                project_status,
                status_date,
                project_cost_estimates,
                project_description,
            } = activeForm;
            return {
                agreement_id,
                project_category,
                name,
                expansion_area,
                project_type,
                project_status,
                status_date,
                project_cost_estimates,
                project_description,
            };
        },
    };
}

// PROJECT COST ESTIMATES
export function getProjectCosts() {
    return {
        type: API_CALL,
        endpoint: GET_PROJECT_COSTS,
        url: '/estimate/',
    };
}

export function getProjectCostID(selectedProjectCost) {
    return {
        type: API_CALL,
        endpoint: GET_PROJECT_COST_ID,
        url: `/estimate/${selectedProjectCost}`,
    };
}

export function getProjectCostQuery() {
    return {
        type: API_CALL,
        endpoint: GET_PROJECT_COST_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/estimate/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function getProjectProjectCosts(selectedProject) {
    return {
        type: API_CALL,
        endpoint: GET_PROJECT_PROJECT_COSTS,
        url: `/estimate/?project_id=${selectedProject}`,
    };
}

export function postProjectCost() {
    return {
        type: API_CALL,
        endpoint: POST_PROJECT_COST,
        url: '/estimate/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                project_id,
                estimate_type,
                land_cost,
                design_cost,
                construction_cost,
                admin_cost,
                management_cost,
                credits_available,
            } = activeForm;
            return {
                project_id,
                estimate_type,
                land_cost,
                design_cost,
                construction_cost,
                admin_cost,
                management_cost,
                credits_available,
            };
        },
    };
}

export function putProjectCost(selectedProjectCost) {
    return {
        type: API_CALL,
        endpoint: PUT_PROJECT_COST,
        url: `/estimate/${selectedProjectCost}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                project_id,
                estimate_type,
                land_cost,
                design_cost,
                construction_cost,
                admin_cost,
                management_cost,
                credits_available,
            } = activeForm;
            return {
                project_id,
                estimate_type,
                land_cost,
                design_cost,
                construction_cost,
                admin_cost,
                management_cost,
                credits_available,
            };
        },
    };
}

// ACCOUNT LEDGERS
export function getAccountLedgers() {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNT_LEDGERS,
        url: '/ledger/',
    };
}

export function getAccountLedgerID(selectedAccountLedger) {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNT_LEDGER_ID,
        url: `/ledger/${selectedAccountLedger}`,
    };
}

export function getAccountLedgerQuery() {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNT_LEDGER_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                query,
            } = activeForm;

            const query_all = `/ledger/?query=${query}&paginatePage`;
            return query_all;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function getLotAccountLedgers(selectedLot) {
    return {
        type: API_CALL,
        endpoint: GET_LOT_ACCOUNT_LEDGERS,
        url: `/ledger/?lot=${selectedLot}`,
    };
}

export function getAccountAccountLedgers(selectedAccount) {
    return {
        type: API_CALL,
        endpoint: GET_ACCOUNT_ACCOUNT_LEDGERS,
        url: `/ledger/?account_from=${selectedAccount}&account_to=${selectedAccount}`,
    };
}

export function getAgreementAccountLedgers(selectedAgreement) {
    return {
        type: API_CALL,
        endpoint: GET_AGREEMENT_ACCOUNT_LEDGERS,
        url: `/ledger/?agreement=${selectedAgreement}`,
    };
}

export function postAccountLedger() {
    return {
        type: API_CALL,
        endpoint: POST_ACCOUNT_LEDGER,
        url: '/ledger/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                entry_date,
                account_from,
                account_to,
                plat,
                lot,
                agreement,
                entry_type,
                non_sewer_credits,
                sewer_credits,
            } = activeForm;
            return {
                entry_date,
                account_from,
                account_to,
                plat,
                lot,
                agreement,
                entry_type,
                non_sewer_credits,
                sewer_credits,
            };
        },
    };
}

export function putAccountLedger(selectedAccountLedger) {
    return {
        type: API_CALL,
        endpoint: PUT_ACCOUNT_LEDGER,
        url: `/ledger/${selectedAccountLedger}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                entry_date,
                account_from,
                account_to,
                plat,
                lot,
                agreement,
                entry_type,
                non_sewer_credits,
                sewer_credits,
            } = activeForm;
            return {
                entry_date,
                account_from,
                account_to,
                plat,
                lot,
                agreement,
                entry_type,
                non_sewer_credits,
                sewer_credits,
            };
        },
    };
}

export function getPagination(page) {
    return {
        type: API_CALL,
        endpoint: GET_PAGINATION,
        url: () => {
            if (!page.includes('paginatePage=true')) {
                return `${page}?paginatePage=true`;
            }
            return `${page}`;
        },
    };
}
