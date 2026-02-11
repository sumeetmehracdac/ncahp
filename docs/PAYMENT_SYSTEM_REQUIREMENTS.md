# **Payment System \- Requirements Document**

| Module Name: | Payment System |
| :---- | :---- |
| **Author:** | Sumeet Mehra |
| **Document Type:** | Functional Requirements Document |
| **Version:** | 1.0 |
| **Last Updated:** | 04-Feb-2026 |

**Version History**

| Version | Date | Author | Description of Change |
| :---- | :---- | :---- | :---- |
| **1.0** | 03-Feb-2026 | Sumeet Mehra | Initial  version |
| **2.0** | 04-Feb-2026 | Sumeet Mehra | INT data types fix |
| **3.0** | 05/Feb-2026 | Sumeet Mehra |  |

1. Relaxations general, any state council  \+ state able to select and assign  
2. Get loaded at runtime into script  
3. Each sets its own from, to 

**Database Schema**

**Table 1/4: app\_master/default\_amount**

**Purpose:** Stores the minimum, maximum, and default fee amounts for each application type. Controls whether state-level customization (relaxation) is allowed.

| Column Name | Data Type | Constraints | Description | Example |
| :---- | :---- | :---- | :---- | :---- |
| **default\_amount\_id** | INT2 | PK, NOT NULL, SEQUENCE | Unique identifier for the default amount record | 1 |
| **application\_type\_id** | INT2 | FK, NOT NULL, UNIQUE | Reference to application\_type\_master | 1 |
| **min\_amount** | DECIMAL (5.2) | NOT NULL, CHECK \>= 0 | Minimum allowed fee amount | 50.00 |
| **max\_amount** | DECIMAL (5,2) | NOT NULL, CHECK \>= min\_amount | Maximum allowed fee amount | 500.00 |
| **default\_amount** | DECIMAL (5,2) | NOT NULL CHECK BETWEEN min AND max | Default fee amount for the application type | 100.00 |
| **is\_relaxation** | BOOLEAN | NOT NULL,  DEFAULT false | If true, states can set custom amounts in state\_specific\_amount | true |
| **is\_gst** | BOOLEAN | NOT NULL, default false | If true, GST is applicable on the final fee amount | true |
| **sgst** | DECIMAL (2,2) | NULL, CHECK \>=0 | State GST rate percentage (applicable for intra-state) | 10.0 |
| **cgst** | DECIMAL (2,2) | NULL, CHECK \>= 0 | Central GST rate percentage (applicable for intra-state) | 10.0 |
| **igst** | DECIMAL (2,2) | NULL, CHECK \>= 0 | Integrated GST rate percentage (applicable for inter-state) | 10.0 |
| **utgst** | DECIMAL (2,2) | NULL, CHECK \>= 0 | Union Territory GST rate percentage (for UT transactions) | 10.0 |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Record creation timestamp | 2026-01-02T00:00:00Z |
| **created\_by** |  |  | (Admin) user who created the record | 10000001 |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last modification timestamp | 2026-01-02T00:00:00Z |
| **updated\_by** |  |  | (Admin) user who modified the record | 10000001 |
| **is\_active** | BOOL | NOT NULL | Active status flag | true |

Constraints:  
\- \`PK\_default\_amount\`: PRIMARY KEY on \`default\_amount\_id\`  
\- \`FK\_default\_amount\_application\_type\`: FOREIGN KEY \`application\_type\_id\` REFERENCES \`application\_type\_master(application\_type\_id)\`  
\- \`UQ\_default\_amount\_application\_type\`: UNIQUE on \`application\_type\_id\` (one entry per application type)  
\- \`CHK\_default\_amount\_min\_positive\`: CHECK \`min\_amount \>= 0\`  
\- \`CHK\_default\_amount\_max\_gte\_min\`: CHECK \`max\_amount \>= min\_amount\`  
\- \`CHK\_default\_amount\_default\_in\_range\`: CHECK \`default\_amount BETWEEN min\_amount AND max\_amount\`  
\- \`CHK\_default\_amount\_sgst\_positive\`: CHECK \`sgst IS NULL OR sgst \>= 0\`  
\- \`CHK\_default\_amount\_cgst\_positive\`: CHECK \`cgst IS NULL OR cgst \>= 0\`  
\- \`CHK\_default\_amount\_igst\_positive\`: CHECK \`igst IS NULL OR igst \>= 0\`  
\- \`CHK\_default\_amount\_utgst\_positive\`: CHECK \`utgst IS NULL OR utgst \>= 0\`

**Table 2/4: app\_master/state\_specific\_amount**

**Purpose:** Stores state-specific fee amounts for each application type within a state council. Only editable when is\_relaxation=true in default\_amount. Amounts must remain within min/max bounds.

| Column Name | Data Type | Constraints | Description | Example |
| :---- | :---- | :---- | :---- | :---- |
| **state\_specific\_amount\_id** | INT2 | PK, NOT NULL, SEQUENCE | Unique Identifier | 1 |
| **state\_council\_id** | INT2 | FK, NOT NULL | Reference to state\_council\_master | 1 |
| **state\_id** | INT2 | FK, NOT NULL | Reference to state\_master | 1 |
| **application\_type\_id** | INT2 | FK, NOT NULL | Reference to application\_type\_master | 1 |
| **amount** | DECIMAL (5,2) | NOT NULL | State-specific  fee amount; must be within min/max bounds | 100.00 |
| **is\_gst** | BOOLEAN | NOT NULL, default false | If true, GST is applicable on the final fee amount | true |
| **sgst** | DECIMAL (2,2) | NULL, CHECK \>=0 | State GST rate percentage (applicable for intra-state) | 10.0 |
| **cgst** | DECIMAL (2,2) | NULL, CHECK \>= 0 | Central GST rate percentage (applicable for intra-state) | 10.0 |
| **igst** | DECIMAL (2,2) | NULL, CHECK \>= 0 | Integrated GST rate percentage (applicable for inter-state) | 10.0 |
| **utgst** | DECIMAL (2,2) | NULL, CHECK \>= 0 | Union Territory GST rate percentage (for UT transactions) | 10.0 |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Record creation timestamp | 2026-01-02T00:00:00Z |
| **created\_by** |  |  | (Admin) user who created the record | 10000001 |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last modification timestamp | 2026-01-02T00:00:00Z |
| **updated\_by** |  |  | (Admin) user who modified the record | 10000001 |
| **is\_active** | BOOL | NOT NULL | Active status flag | true |

Constraints:

\- \`PK\_state\_specific\_amount\`: PRIMARY KEY on \`state\_specific\_amount\_id\`  
\- \`FK\_state\_specific\_amount\_state\_council\`: FOREIGN KEY \`state\_council\_id\` REFERENCES \`state\_council\_master(state\_council\_id)\`  
\- \`FK\_state\_specific\_amount\_state\`: FOREIGN KEY \`state\_id\` REFERENCES \`state\_master(state\_id)\`  
\- \`FK\_state\_specific\_amount\_application\_type\`: FOREIGN KEY \`application\_type\_id\` REFERENCES \`application\_type\_master(application\_type\_id)\`  
\- \`UQ\_state\_specific\_amount\_composite\`: UNIQUE on (\`state\_council\_id\`, \`state\_id\`, \`application\_type\_id\`) \- one entry per state per application type  
\- \`CHK\_state\_specific\_amount\_positive\`: CHECK \`amount \>= 0\`  
\- \`CHK\_state\_specific\_amount\_sgst\_positive\`: CHECK \`sgst IS NULL OR sgst \>= 0\`  
\- \`CHK\_state\_specific\_amount\_cgst\_positive\`: CHECK \`cgst IS NULL OR cgst \>= 0\`  
\- \`CHK\_state\_specific\_amount\_igst\_positive\`: CHECK \`igst IS NULL OR igst \>= 0\`  
\- \`CHK\_state\_specific\_amount\_utgst\_positive\`: CHECK \`utgst IS NULL OR utgst \>= 0\`

Business Rule: The \`state\_id\` must belong to the \`num\_state\_council\_id\` (validated in application layer via state\_master.num\_state\_council\_id relationship).  
GST Inheritance Rule: If \`is\_gst\` or any GST rate (sgst, cgst, igst, utgst) is NULL in state\_specific\_amount, the corresponding value from default\_amount is used.

**Table 3/4: app\_master/relaxation\_master**

**Purpose:** Stores relaxation criteria as SQL WHERE clauses (validated via JSqlParser) that match applicant data from app\_master schema. Each relaxation has an associated discount/adjusted amount. Visibility: is\_visible=true → all state councils; is\_visible=false → only target state council specified in target\_state\_council\_id.

| Column Name | Data Type | Constraints | Description | Example |
| :---- | :---- | :---- | :---- | :---- |
| **relaxation\_id** | INT2 | PK, NOT NULL, SEQUENCE | Unique Identifier | 1 |
| **relaxation\_name** | VARCHAR (100) | NOT NULL | Human-readable name for the relaxation | “Women Candidate Discount” |
| **str\_relaxation\_description** | TEXT | NULL | Detailed description of the relaxation criteria, to be filled by respective state council | “50% off to all woman candidates over the age of 32, from 04/02/2026 \- 20/04/2026” |
| **relaxation\_query** | TEXT | NOT NULL | SQL query fragment to match applicant criteria |  |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Record creation timestamp | 2026-01-02T00:00:00Z |
| **created\_by** |  |  | (Admin) user who created the record | 10000001 |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last modification timestamp | 2026-01-02T00:00:00Z |
| **updated\_by** |  |  | (Admin) user who modified the record | 10000001 |
| **is\_active** | BOOL | NOT NULL | Active status flag | true |

Constraints:

\- \`PK\_relaxation\_master\`: PRIMARY KEY on \`num\_relaxation\_id\`  
\- \`CHK\_relaxation\_master\_valid\_from\_not\_past\`: CHECK \`dt\_valid\_from IS NULL OR dt\_valid\_from \>= CURRENT\_DATE\`  
\- \`CHK\_relaxation\_master\_valid\_to\_not\_past\`: CHECK \`dt\_valid\_to IS NULL OR dt\_valid\_to \>= CURRENT\_DATE\`

**Table 4/5: app\_master/stakeholder\_relaxation**

**Purpose:** Maps relaxations to stakeholders. For NCAHP Commission and State Councils (per-state selections within council. Includes priority ordering to determine which relaxation applies when multiple criteria match an applicant).

| Column Name | Data Type | Constraints | Description | Example |
| :---- | :---- | :---- | :---- | :---- |
| **stakeholder\_relaxation\_id** | INT2 | PK, NOT NULL, SEQUENCE | Unique Identifier | 1 |
| **stakeholder\_type\_id** | INT2 | FK, NOT NULL | Reference to stakeholder\_type\_master (21=NCAHP, 23 \= State Council) | 21 |
| **state\_council\_id** | INT2 | FK, NOT NULL | Reference for state\_council\_master | “Women Candidate Discount” |
| **state\_id** | INT2 | FK, NOT NULL | Reference to state\_master | 2 |
| **application\_type\_id** | INT2 | FK, NOT NULL | Reference to application\_type\_master | 1 |
| **relaxation\_id** | INT2 | FK, NOT NULL | Reference to relaxation\_master | 1 |
| **amount** | DECIMAL(5,2) |  |  |  |
| **from\_date** | DATE | NULL |  |  |
| **to\_date** | DATE | NULL |  |  |
| **order** | INT2 | NOT NULL CHECK \> 0 | Priority order (1 \= highest priority, applied first) | 1 |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Record creation timestamp | 2026-01-02T00:00:00Z |
| **created\_by** |  |  | (Admin) user who created the record | 10000001 |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last modification timestamp | 2026-01-02T00:00:00Z |
| **updated\_by** |  |  | (Admin) user who modified the record | 10000001 |
| **is\_active** | BOOL | NOT NULL | Active status flag | true |

Constraints:  
\- \`PK\_stakeholder\_relaxation\`: PRIMARY KEY on \`stakeholder\_relaxation\_id\`  
\- \`FK\_stakeholder\_relaxation\_stakeholder\_type\`: FOREIGN KEY \`stakeholder\_type\_id\` REFERENCES \`stakeholder\_type\_master(num\_stakeholder\_type\_id)\`  
\- \`FK\_stakeholder\_relaxation\_state\_council\`: FOREIGN KEY \`state\_council\_id\` REFERENCES \`state\_council\_master(num\_state\_council\_id)\`  
\- \`FK\_stakeholder\_relaxation\_state\`: FOREIGN KEY \`state\_id\` REFERENCES \`state\_master(state\_id)\`  
\- \`FK\_stakeholder\_relaxation\_application\_type\`: FOREIGN KEY \`application\_type\_id\` REFERENCES \`application\_type\_master(application\_type\_id)\`  
\- \`FK\_stakeholder\_relaxation\_relaxation\`: FOREIGN KEY \`relaxation\_id\` REFERENCES \`relaxation\_master(relaxation\_id)\`  
\- \`UQ\_stakeholder\_relaxation\_composite\`: UNIQUE on (\`stakeholder\_type\_id\`, \`state\_council\_id\`, \`state\_id\`, \`application\_type\_id\`, \`relaxation\_id\`) \- prevent duplicate relaxation assignments  
\- \`UQ\_stakeholder\_relaxation\_order\`: UNIQUE on (\`stakeholder\_type\_id\`, \`state\_council\_id\`, \`state\_id\`, \`application\_type\_id\`, \`priority\_order\`) \- unique order per stakeholder context  
\- \`CHK\_stakeholder\_relaxation\_order\_positive\`: CHECK \`priority\_order \> 0\`  
\- \`CHK\_stakeholder\_context\`: CHECK \`(stakeholder\_type\_id \= 21 AND state\_council\_id IS NULL AND state\_id IS NULL) OR (stakeholder\_type\_id \= 23 AND state\_council\_id IS NOT NULL AND state\_id IS NOT NULL)\` \- NCAHP must have NULL council/state; State Council must have both  
\- \`CHK\_sr\_amount\_positive\`: CHECK \`amount \>= 0\` (V1.4)  
\- \`CHK\_sr\_date\_range\`: CHECK \`to\_date IS NULL OR from\_date IS NULL OR to\_date \>= from\_date\` (V1.4)

Business Rules:  
\- For NCAHP Commission (stakeholder\_type\_id=21): Relaxation selections apply at national level (application\_type only)  
\- For State Council (stakeholder\_type\_id=23): Relaxation selections apply per-state within the council  
\- The \`state\_id\` must belong to the \`state\_council\_id\` for State Council entries (validated in application layer)

**Table 5/5: app\_master/relaxation\_application**

**Purpose:** Stores applications from State Council Admins requesting new relaxations to be added to relaxation\_master. NCAHP Admin reviews and approves/rejects these requests.

| Column Name | Data Type | Constraints | Description | Example |
| :---- | :---- | :---- | :---- | :---- |
| **relaxation\_application\_id** | INT2 | PK, NOT NULL, SEQUENCE | Unique Identifier | 1 |
| **state\_council\_id** | INT2 | FK, NOT NULL | State council submitting the application | 1 |
| **description** | TEXT | NOT NULL | Text description of the requested relaxation | “Discount for senior citizens above 60 years” |
| **status** | ENUM | NOT NULL, DEFAUL ‘PENDING’ | Application status: PENDING, APPROVED, REJECTED | PENDING |
| **admin\_remarks** | TEXT | NULL | Admin remarks on approval, rejection | “Aprooved. Added as relaxation ID 5” |
| **approved\_relaxation\_id** | INT2 | FK, NULL | Reference  to created relaxation\_master entry (if approved) | 5 |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Record creation timestamp | 2026-01-02T00:00:00Z |
| **created\_by** |  |  | (Admin) user who created the record | 10000001 |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last modification timestamp | 2026-01-02T00:00:00Z |
| **updated\_by** |  |  | (Admin) user who modified the record | 10000001 |
| **is\_active** | BOOL | NOT NULL | Active status flag | true |

Enum Definition \- RelaxationApplicationStatus:  
\- \`PENDING\` \- Application submitted, awaiting review  
\- \`APPROVED\` \- Application approved by NCAHP Admin  
\- \`REJECTED\` \- Application rejected by NCAHP Admin

Constraints:  
\- \`PK\_relaxation\_application\`: PRIMARY KEY on \`relaxation\_application\_id\`  
\- \`FK\_relaxation\_application\_state\_council\`: FOREIGN KEY \`state\_council\_id\` REFERENCES \`state\_council\_master(state\_council\_id)\`  
\- \`FK\_relaxation\_application\_approved\_relaxation\`: FOREIGN KEY \`approved\_relaxation\_id\` REFERENCES \`relaxation\_master(relaxation\_id)\`  
\- \`CHK\_relaxation\_application\_amount\_positive\`: CHECK \`proposed\_amount \>= 0\`  
\- \`CHK\_relaxation\_application\_date\_range\`: CHECK \`proposed\_valid\_to IS NULL OR proposed\_valid\_from IS NULL OR proposed\_valid\_to \>= proposed\_valid\_from\`

**Functional Requirements**

**Default Amount Management (NCAHP Commission ADMIN only)**

| ID | Requirement Description | Version |
| :---- | :---- | :---- |
| **FR-01** | Only users with role='ADMIN' AND stakeholder\_type\_name='NCAHP' (from stakeholder\_type\_master) can view the default\_amount list | V1.0 |
| **FR-02** | Only NCAHP Admin can add a new default\_amount entry for an application type | V1.0 |
| **FR-03** | Only NCAHP Admin can edit an existing default\_amount entry (min, max, default amounts, is\_relaxation flag) | V1.0 |
| **FR-04** | Only NCAHP Admin can soft-delete a default\_amount entry | V1.0 |
| **FR-05** | System shall validate that max\_amount \>= min\_amount | V1.0 |
| **FR-06** | System shall validate that default\_amount is between min\_amount and max\_amount | V1.0 |
| **FR-07** | Each application\_type can have only one default\_amount entry (unique constraint) | V1.0 |
| **FR-08** | When is\_relaxation is set to false, system shall prevent any state from adding custom amounts in state\_specific\_amount for that application type | V1.0 |
|  | NCAHP Admin can set GST applicability (is\_gst) and default GST rates (sgst, cgst, igst, utgst) for each application type |  |
|  | System shall validate that GST rates are non-negative when provided |  |
|  | GST rates defined in default\_amount serve as the baseline rates that can be overridden at state level |  |
|  | NCAHP Admin can optionally reflect default\_amount changes to all state\_specific\_amount entries using the reflectToStateCouncils parameter |  |
|  | When reflecting, NCAHP Admin chooses behavior: OVERWRITE (update all state\_specific\_amount entries) or SKIP\_CUSTOMIZED (preserve entries where amount differs from previous default) |  |

**State Specific Amount Management (State Council ADMIN)**

| ID | Requirement Description | Version |
| :---- | :---- | :---- |
| **FR-01** | Only users with role='ADMIN' can view state\_specific\_amount entries for their own state\_council\_id (extracted from JWT) | V1.0 |
| **FR-02** | When a default\_amount entry is created with is\_relaxation=true, system shall immediately auto-populate state\_specific\_amount entries with the default\_amount for ALL states in ALL active state councils | V1.0 |
| **FR-03** | State Council Admin can view state\_specific\_amount entries only for states within their state council | V1.0 |
| **FR-04** | State Council Admin can edit the amount in state\_specific\_amount only if is\_relaxation=true for that application type in default\_amount | V1.0 |
| **FR-05** | System shall validate that edited amount is within min\_amount and max\_amount bounds from default\_amount | V1.0 |
| **FR-06** | Different amounts can be set for different states within the same state council | V1.0 |
| **FR-07** | System shall validate that state\_id belongs to the state\_council\_id (via state\_master relationship) | V1.0 |
| **FR-08** | State Council Admin cannot add/delete state\_specific\_amount entries manually (auto-managed by system based on default\_amount) | V1.0 |
|  | State Council Admin can optionally override GST settings (is\_gst, sgst, cgst, igst, utgst) for their state; NULL values inherit from default\_amount |  |
|  | System shall display effective GST rates in the response, showing whether each rate is inherited from default\_amount or overridden at state level |  |

**Relaxation Master Management (NCAHP ADMIN)**

| ID | Requirement Description | Version |
| :---- | :---- | :---- |
| **FR-01** | Only NCAHP Admin can add new relaxation entries to relaxation\_master | V1.0 |
| **FR-02** | Only NCAHP Admin can edit relaxation entries (name, description, query) | V1.0 |
| **FR-03** | Only NCAHP Admin can soft-delete relaxation entries | V1.0 |
| **FR-04** | All relaxations with is\_active=true are visible to ALL stakeholders (State Council Admins and NCAHP Commission) | V1.0 |
| **FR-10** | The relaxation\_query shall store SQL WHERE clause conditions that will be executed dynamically against applicant data from app\_master schema at fee calculation time | V1.0 |
| **FR-11** | System shall validate relaxation query syntax using JSqlParser before saving (block destructive SQL: DROP, DELETE, UPDATE, INSERT, TRUNCATE) | V1.0 |
| **FR-12** | relaxation\_query is nullable; if null, the relaxation cannot be auto-evaluated and must be manually applied | V1.0 |
| **FR-13** | System shall validate during create/edit that valid\_from and valid\_to are not in the past (application layer validation) | V1.0 |

**Stakeholder  Relaxation Management**

| ID | Requirement Description | Version |
| :---- | :---- | :---- |
| **FR-01** | Both stakeholders – NCAHP \+ State Council \- can view all active relaxations | V1.0 |
| **FR-02** | State Council Admin can assign relaxations to specific states within their state council for specific application types | V1.0 |
| **FR-03** | State Council Admin can set the priority\_order for each assigned relaxation per state per application type | V1.0 |
| **FR-04** | State Council Admin can modify the order of relaxations through the client interface (drag-and-drop reordering) | V1.0 |
| **FR-05** | Different states within the same state council can have different relaxations and different ordering | V1.0 |
| **FR-06** | When an applicant qualifies for multiple relaxations, only the relaxation with the lowest priority\_order (highest priority) shall apply | V1.0 |
| **FR-07** | State Council Admin can remove (soft-delete) a relaxation assignment from a state | V1.0 |
| **FR-08** | System shall prevent duplicate relaxation assignments (same relaxation to same state for same application type) | V1.0 |
| **FR-09** | System shall ensure unique priority\_order numbers per state per application type | V1.0 |
|  | NCAHP Commission can select relaxations at national level (application\_type only, no state context) stored in stakeholder\_relaxation with stakeholder\_type\_id=21 |  |
|  | NCAHP relaxation selections apply when the application type routes to NCAHP Commission for processing |  |
|  | State Council relaxation selections (stakeholder\_type\_id=23) apply when application routes to State Council, evaluated per-state within the council |  |
|  | Each stakeholder (State Council or NCAHP) must define their own amount (required field) for each relaxation they select |  |
|  | Each stakeholder can optionally define from\_date and to\_date for each relaxation configuration |  |
|  | System validates from\_date is not in the past during create/edit (application layer validation) |  |
|  | System validates to\_date \>= from\_date when both are provided (database constraint \+ application layer) |  |
|  | System loads all stakeholder relaxation configurations into cache at startup via @PostConstruct |  |
|  | Cache is refreshed on-demand after any CRUD operation (add/update/delete) on stakeholder\_relaxation |  |
|  | During fee calculation, only relaxations where current date is within from\_date/to\_date range (or dates are NULL) are considered |  |

**Relaxation Application Management (Form)**

| ID | Requirement Description | Version |
| :---- | :---- | :---- |
| **FR-01** | State Council Admin can submit an application requesting a new relaxation | V1.0 |
| **FR-03** | Submitted applications shall have status='PENDING' by default | V1.0 |
| **FR-04** | State Council Admin can view their own submitted applications and their status | V1.0 |
| **FR-05** | NCAHP Admin can view all pending relaxation applications from all state councils | V1.0 |
| **FR-06** | NCAHP Admin can approve a relaxation application (status='APPROVED') and create corresponding relaxation\_master entry with name, description and query.  | V1.0 |
| **FR-07** | NCAHP Admin can reject a relaxation application (status='REJECTED') with remarks | V1.0 |
| **FR-08** | When approved, system shall link the created relaxation\_master entry via approved\_relaxation\_id | V1.0 |
| **FR-09** | System shall record review timestamp and reviewer ID when application is approved/rejected | V1.0 |
| **FR-10** | State Council Admin cannot edit or delete submitted applications (immutable after submission) | V1.0 |
| **FR-11** | After approoval, state council configures own amount/ dates in stakeholder\_relaxation | V1.0 |

**Fee Calculation Engine**

| ID | Requirement Description | Version |
| :---- | :---- | :---- |
| **FR-01** | System shall calculate the final fee for an applicant based on application type, state, and applicable relaxations | V1.0 |
| **FR-02** | Fee calculation has two major flows based on application routing: NCAHP Commission flow: (1) Check stakeholder\_relaxation where stakeholder\_type\_id=21 for matching relaxations ordered by priority\_order, (2) If relaxation matches, use stakeholder\_relaxation.amount, (3) Otherwise use default\_amount. State Council flow: (1) Check stakeholder\_relaxation where stakeholder\_type\_id=23 and matching state\_council\_id/state\_id for relaxations ordered by priority\_order, (2) If relaxation matches, use stakeholder\_relaxation.amount, (3) Otherwise use state\_specific\_amount if available, (4) Fallback to default\_amount | V1.0 |
| **FR-03** | When evaluating relaxations, system shall execute relaxation\_query against applicant data to determine eligibility; if query is NULL, that relaxation is skipped in auto-evaluation | V1.0 |
| **FR-04** | Relaxation validity determined by from\_date/to\_date in stakeholder\_relaxation | V1.0 |
| **FR-05** | If multiple relaxations match an applicant, only the first matching relaxation (lowest priority\_order) shall apply | V1.0 |
| **FR-06** | System shall provide an API endpoint to calculate fee given applicant details, application type, and state | V1.0 |
| **FR-07** | System shall calculate GST amounts based on effective GST rates (state-specific if set, otherwise default) | V1.0 |
| **FR-08** | Fee calculation response shall include: base fee amount, GST breakdown (sgst, cgst, igst, utgst amounts), total GST amount, and final amount with GST | V1.0 |
| **FR-09** | GST calculation shall only be performed when is\_gst=true (either at state level or inherited from default) | V1.0 |
| **FR-10** | System shall determine applicable GST type based on transaction context (intra-state: SGST+CGST, inter-state: IGST, UT: UTGST+CGST) | V1.0 |
| **FR-11** | Fee calculation uses cached relaxation data from StakeholderRelaxationCache for performance |  |
| **FR-12** | When relaxation matches, use amount from stakeholder\_relaxation  |  |

Future enhancements

\- Fee calculation preview/simulation tool for State Council Admins

\- Notification system when relaxation applications are approved/rejected

\- Historical fee tracking for reporting and analytics

\- Integration with payment gateway for actual fee collection

Main doubts;

1. If is\_relaxation is false, does that restrict state councils from changing fee amount as well as applying for relaxations, or only the former?   
2. Finalise  naming for stakeholders

