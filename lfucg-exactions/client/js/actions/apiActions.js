import { map, reduce, filter, compose } from 'ramda';

import {
  API_CALL,
} from '../constants/actionTypes';

import {
    ME,

    LOGIN,
    LOGOUT,
    PASSWORD,
    RESET_PASSWORD,

    GET_SUBDIVISIONS,
    GET_SUBDIVISION_ID,
    POST_SUBDIVISION,
    PUT_SUBDIVISION,

    GET_PLATS,
    GET_PLAT_ID,
    GET_SUBDIVISION_PLATS,
    POST_PLAT,
    PUT_PLAT,

    POST_PLAT_ZONE,
    PUT_PLAT_ZONE,
    PUT_PLAT_ZONE_DUES,

    GET_LOTS,
    GET_LOT_ID,
    GET_SUBDIVISION_LOTS,
    GET_PLAT_LOTS,
    POST_LOT,
    PUT_LOT,
    PUT_PERMIT_ID_ON_LOT,

    GET_ACCOUNTS,
    GET_ACCOUNT_ID,
    GET_LFUCG_ACCOUNT,
    POST_ACCOUNT,
    PUT_ACCOUNT,

    GET_NOTE_CONTENT,
    GET_SECONDARY_NOTE_CONTENT,
    POST_NOTE,

    GET_UPLOAD_CONTENT,
    POST_UPLOAD,

    GET_AGREEMENTS,
    GET_AGREEMENT_ID,
    GET_ACCOUNT_AGREEMENTS,
    POST_AGREEMENT,
    PUT_AGREEMENT,

    GET_PAYMENTS,
    GET_PAYMENT_ID,
    GET_LOT_PAYMENTS,
    GET_ACCOUNT_PAYMENTS,
    GET_AGREEMENT_PAYMENTS,
    POST_PAYMENT,
    PUT_PAYMENT,

    GET_PROJECTS,
    GET_PROJECT_ID,
    GET_AGREEMENT_PROJECTS,
    POST_PROJECT,
    PUT_PROJECT,

    GET_PROJECT_COSTS,
    GET_PROJECT_COST_ID,
    GET_PROJECT_PROJECT_COSTS,
    POST_PROJECT_COST,
    PUT_PROJECT_COST,

    GET_ACCOUNT_LEDGERS,
    GET_ACCOUNT_LEDGER_ID,
    GET_LOT_ACCOUNT_LEDGERS,
    GET_ACCOUNT_ACCOUNT_LEDGERS,
    GET_AGREEMENT_ACCOUNT_LEDGERS,
    POST_ACCOUNT_LEDGER,
    PUT_ACCOUNT_LEDGER,

    GET_RATE_TABLES,
    GET_RATE_TABLE_ID,
    POST_RATE_TABLE,
    PUT_RATE_TABLE,
    PUT_RATE_TABLE_ACTIVE,

    GET_RATES,
    POST_RATE,
    PUT_RATE,

    GET_PAGINATION,
    SEARCH_QUERY,

    POST_DELETE,

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

export function passwordForgot() {
    return {
        type: API_CALL,
        endpoint: PASSWORD,
        url: '/forgot-password/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                email_forgot_password,
            } = activeForm;
            return {
                email_forgot_password,
            };
        },
    };
}

export function passwordReset(token, uid) {
    return {
        type: API_CALL,
        endpoint: RESET_PASSWORD,
        url: '/password_reset/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                password_1,
                password_2,
            } = activeForm;
            return {
                password_1,
                password_2,
                token,
                uid,
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

export function getSubdivisionLots(selectedSubdivision) {
    return {
        type: API_CALL,
        endpoint: GET_SUBDIVISION_LOTS,
        url: `/lot/?plat__subdivision=${selectedSubdivision}`,
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
                certificate_of_occupancy_final,
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
                address_full: `${address_number} ${address_direction ? address_direction : ''} ${address_street} ${address_suffix ? address_suffix : ''} ${address_unit ? address_unit : ''}, Lexington, KY ${address_zip ? address_zip : ''}`,
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
                certificate_of_occupancy_final,
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
                certificate_of_occupancy_final,
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
                address_full: `${address_number} ${address_direction ? address_direction : ''} ${address_street} ${address_suffix ? address_suffix : ''} ${address_unit ? address_unit : ''}, Lexington, KY ${address_zip ? address_zip : ''}`,
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
                certificate_of_occupancy_final,
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
export function getNoteContent(
    content_type,
    object_id,
    ) {
    return {
        type: API_CALL,
        endpoint: GET_NOTE_CONTENT,
        url: `/note/?content_type=${content_type}&object_id=${object_id}`,
    };
}

export function getSecondaryNoteContent(
    content_type,
    object_id,
    ) {
    return {
        type: API_CALL,
        endpoint: GET_SECONDARY_NOTE_CONTENT,
        url: `/note/?content_type=${content_type}&object_id=${object_id}`,
    };
}

export function postNote(content_type, object_id) {
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
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                file_content_type,
                file_object_id,
            } = activeForm;
            return `/upload/?file_content_type=${file_content_type}&file_object_id=${file_object_id}`;
        },
    };
}

export function postUpload(files) {
    return {
        type: API_CALL,
        endpoint: POST_UPLOAD,
        url: '/upload/create/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
                currentUser,
            } = getState();
            const formData = new FormData();

            formData.append('upload', files[0]);
            formData.append('file_content_type', activeForm.file_content_type);
            formData.append('file_object_id', activeForm.file_object_id);
            formData.append('user', currentUser.id);

            return formData;
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
        url: `/ledger/?acct=${selectedAccount}`,
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
                plat_lot,
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
                plat_lot,
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
                plat_lot,
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
                plat_lot,
            };
        },
    };
}

export function getRateTables() {
    return {
        type: API_CALL,
        endpoint: GET_RATE_TABLES,
        url: '/rateTable/',
    };
}

export function getRateTableID(selectedRateTable) {
    return {
        type: API_CALL,
        endpoint: GET_RATE_TABLE_ID,
        url: `/rateTable/${selectedRateTable}`,
    };
}

export function postRateTable() {
    return {
        type: API_CALL,
        endpoint: POST_RATE_TABLE,
        url: '/rateTable/',
        method: 'POST',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                resolution_number,
                begin_effective_date,
                end_effective_date,
            } = activeForm;
            return {
                resolution_number,
                begin_effective_date,
                end_effective_date,
            };
        },
    };
}

export function putRateTable(selectedRateTable) {
    return {
        type: API_CALL,
        endpoint: PUT_RATE_TABLE,
        url: `/rateTable/${selectedRateTable}/`,
        method: 'PUT',
        body: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                resolution_number,
                begin_effective_date,
                end_effective_date,
            } = activeForm;
            return {
                resolution_number,
                begin_effective_date,
                end_effective_date,
            };
        },
    };
}

export function putRateTableActive(selectedRateTable) {
    return {
        type: API_CALL,
        endpoint: PUT_RATE_TABLE_ACTIVE,
        url: `/rateTable/${selectedRateTable}/`,
        method: 'PUT',
        body: {
            is_active: true,
            id: selectedRateTable,
        },
    };
}

export function getRates(selectedRateTable) {
    return {
        type: API_CALL,
        endpoint: GET_RATES,
        url: `/rate/?rate_table_id=${selectedRateTable}`,
    };
}

export function postRate(rate_table_id, category, zone, expansion_area, rate) {
    return {
        type: API_CALL,
        endpoint: POST_RATE,
        url: '/rate/',
        method: 'POST',
        body: {
            rate_table_id,
            category,
            zone,
            expansion_area,
            rate,
        },
    };
}

export function putRate(selectedRate, rate) {
    return {
        type: API_CALL,
        endpoint: PUT_RATE,
        url: `/rate/${selectedRate}/`,
        method: 'PUT',
        body: {
            rate,
        },
    };
}

export function getPagination(page) {
    return {
        type: API_CALL,
        endpoint: GET_PAGINATION,
        url: (getState) => {
            const {
                activeForm,
            } = getState();
            const {
                currentPage,
                page_size,
            } = activeForm;

            if (!page) {
                if (currentPage === '/credit-transfer/') {
                    return '/ledger/?paginatePage';
                }

                if (currentPage === '/project-cost/') {
                    return '/estimate/?paginatePage';
                }

                if (page_size) {
                    return `${currentPage}?paginatePage&pageSize=${page_size}`;
                }
                return `${currentPage}?paginatePage`;
            }
            if (page.indexOf('paginatePage') === -1) {
                return `${page}?paginatePage`;
            }
            return `${page}`;
        },
    };
}

export function searchQuery() {
    return {
        type: API_CALL,
        endpoint: SEARCH_QUERY,
        url: (getState) => {
            const {
                activeForm,
            } = getState();


            let query_all = `${activeForm.currentPage}?paginatePage`;

            if (activeForm.currentPage === '/credit-transfer/') {
                query_all = '/ledger/?paginatePage';
            }

            if (activeForm.currentPage === '/project-cost/') {
                query_all = '/estimate/?paginatePage';
            }

            const queryString = compose(
                reduce((acc, value) => acc + value, query_all),
                map((key_name) => {
                    const filter_index = key_name.indexOf('filter_') + 'filter_'.length;
                    const field = key_name.slice(filter_index, key_name.length);
                    return `&${field}=${activeForm[key_name]}`;
                }),
                filter(key_name => activeForm[key_name] && (key_name.indexOf('filter_') !== -1)),
            )(Object.keys(activeForm));
            return queryString;
        },
        meta: {
            debounce: {
                time: 300,
            },
        },
    };
}

export function postDelete(currentForm, selectedEntry) {
    return {
        type: API_CALL,
        endpoint: POST_DELETE,
        url: `${currentForm}${selectedEntry}/`,
        method: 'PUT',
        body: () => {
            return {
                is_active: false,
            };
        },
    };
}

