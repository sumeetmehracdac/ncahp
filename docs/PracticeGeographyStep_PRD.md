# Practice Geography Step — Form Body PRD

## 1. Purpose

This document specifies the **form body only** for the Practice Geography step used in the Permanent Registration module (Form 1A). It excludes all surrounding chrome (application type strip, stepper, step context card, navigation buttons, header, footer).

---

## 2. Scope

- **Module:** `/permanent-registration` → Form 1A, Step 8 ("Practice Location")
- **Component:** `PracticeGeographyStep`
- **Boundary:** Begins immediately below the Step Context Card; ends immediately above the Next/Previous navigation buttons.

---

## 3. Data Model

### 3.1 Parent Form Fields Consumed

| Field | Type | Source |
|---|---|---|
| `stateOfResidence` | `string` | Selected earlier in Personal Information step |
| `practiceInOtherState` | `boolean` | Controlled by toggle in this step |
| `practiceStates` | `PracticeState[]` | Array managed in this step |

### 3.2 `PracticeState` Interface

```ts
interface PracticeState {
  state: string;               // Indian state name
  proofDocument: File | null;  // Uploaded proof file
  institutionName: string;     // Name of clinic/lab/hospital/institution
  institutionAddress: string;  // Full address of the institution
}
```

### 3.3 Constants

- `indianStates`: `string[]` — Full list of Indian states and union territories, imported from the parent module.

---

## 4. Layout & Sections

The form body is a single vertical stack (`space-y-8`) containing the following sections rendered conditionally.

### 4.1 Current State Display (Always Visible)

- **Container:** Rounded card (`rounded-xl`) with muted background (`bg-slate-50`), border, and `p-5` padding.
- **Content:**
  - Left: Icon container (40×40px, `bg-primary/10`, rounded-lg) with a `MapPin` icon (20×20, `text-primary`).
  - Right of icon:
    - Label: `"Your State of Registration"` — small, muted text.
    - Value: `{formData.stateOfResidence}` or `"Not selected"` — semibold, foreground color.

### 4.2 Intent Toggle (Always Visible)

- **Container:** White card (`bg-white`, `rounded-xl`, `p-6`, border, shadow-sm).
- **Layout:** Flex row, items top-aligned, gap-4, with text on the left and toggle on the right.
- **Left side:**
  - **Label** (linked to toggle via `htmlFor`): `"Do you intend to practice in a state other than your state of residence?"` — base size, semibold.
  - **Helper text:** `"If yes, you'll need to provide proof of practice for each additional state."` — small, muted.
- **Right side:** `<Switch>` component.
  - `checked`: `formData.practiceInOtherState`
  - `onCheckedChange`: Calls `handleToggleChange(checked)`.
- **Toggle Behaviour:**
  - When toggled ON: If `practiceStates` is empty, automatically add one blank `PracticeState` entry.
  - When toggled OFF: Clear the entire `practiceStates` array.

### 4.3 Practice States Section (Visible only when toggle is ON)

Wrapped in `<AnimatePresence>` with a `<motion.div>` that animates opacity and height on enter/exit.

#### 4.3.1 Info Banner

- **Container:** `bg-amber-50`, `rounded-xl`, border `border-amber-200`, padding `p-4`.
- **Icon:** `AlertTriangle` (20×20, `text-amber-600`), flex-shrink-0, top-aligned.
- **Text (amber-800):**
  - **Title:** `"Proof of Practice Required"` — font-medium.
  - **Body:** `"For each state selected, you must upload valid proof of practice such as employment letter, clinic registration, or practice address proof."`

#### 4.3.2 State Entry Cards (Repeated per `practiceStates` entry)

Each card is a `<motion.div>` with enter animation (`opacity: 0, y: -10` → `opacity: 1, y: 0`) and exit animation (`opacity: 0, x: -20`).

- **Container:** White card, `rounded-xl`, `p-5`, border, shadow-sm.
- **Header row:** Flex, space-between.
  - Left: `"Additional Practice State #N"` — small, font-medium, primary color.
  - Right: Ghost icon button (`Trash2`, 16×16) to remove the entry. Hover state: `text-destructive`, `bg-destructive/10`.

- **Fields** (vertical stack, `grid-cols-1`, `gap-4`):

| # | Field | Type | Placeholder | Required | Notes |
|---|---|---|---|---|---|
| 1 | **Select State** | `<Select>` dropdown | `"Choose a state"` | Yes | Options: `indianStates` minus already-selected states minus `stateOfResidence`. Height: `h-11`. Dropdown bg: white, max-height: 60. |
| 2 | **Institution Name** | `<Input>` text | `"Name of clinic, lab, hospital or institution"` | Yes | Height: `h-10`. Label: `"Clinic/Lab/Hospital/Institution Name"`. |
| 3 | **Institution Address** | `<Input>` text | `"Complete address of the institution"` | Yes | Height: `h-10`. Label includes inline `MapPin` icon (12×12). Label: `"Clinic/Lab/Hospital/Institution Address"`. |
| 4 | **Proof of Practice** | File upload | `"Upload proof document"` | Yes | Accepts: `.pdf, .jpg, .jpeg, .png`. Custom styled upload area (see §4.3.3). |

#### 4.3.3 Proof Upload Field Specification

- **Implementation:** Hidden `<input type="file">` overlaid on a styled `div` (absolute positioning, opacity-0, cursor-pointer).
- **Visual container:** Flex row, `h-11`, `px-4`, rounded-md, border, transition.
- **States:**
  - **Empty:** `border-input`, hover → `border-primary/50`. Shows `Upload` icon (16×16, muted) + `"Upload proof document"` (small, muted).
  - **File selected:** `border-green-500`, `bg-green-50`. Shows `FileCheck` icon (16×16, `text-green-600`) + file name (small, `text-green-700`, truncated).

#### 4.3.4 Add Another State Button

- **Position:** Below all state cards, full width.
- **Style:** Outline variant, `h-12`, dashed border (`border-dashed border-2`). Hover: `border-primary`, `bg-primary/5`.
- **Content:** `Plus` icon (20×20) + `"Add Another State"`.
- **Action:** Appends a new blank `PracticeState` to the array.

### 4.4 Single State Message (Visible only when toggle is OFF)

- **Animation:** Fade in (`opacity: 0` → `1`).
- **Container:** `bg-green-50`, `rounded-xl`, border `border-green-200`, `p-4`.
- **Icon:** `Info` (20×20, `text-green-600`), flex-shrink-0, top-aligned.
- **Text (green-800):**
  - **Title:** `"Single State Practice"` — font-medium.
  - **Body:** `"You've indicated that you will practice only in {stateOfResidence}. Your registration will be processed through the {stateOfResidence} State Council."`

### 4.5 Summary Strip (Visible when toggle is ON and at least one state entry exists)

- **Animation:** Fade in.
- **Container:** Gradient background (`from-slate-50 to-primary/5`), `rounded-xl`, `p-4`, border.
- **Layout:** Flex row, space-between.
- **Left stat:** `"Additional states: {count}"` — count of entries where `state !== ''`. Count is bold foreground.
- **Right stat:** `"Proofs attached: {count}"` — count of entries where `proofDocument !== null`. Count is bold primary.

---

## 5. Business Rules

| Rule | Description |
|---|---|
| **State uniqueness** | A state cannot be selected more than once across all entries. |
| **Exclude home state** | The user's `stateOfResidence` is excluded from available options in every dropdown. |
| **Auto-add on toggle** | Toggling ON with zero entries automatically creates one blank entry. |
| **Clear on toggle off** | Toggling OFF removes all entries. |
| **File types** | Only `.pdf`, `.jpg`, `.jpeg`, `.png` accepted for proof upload. |

---

## 6. Animations

| Element | Library | Enter | Exit |
|---|---|---|---|
| Practice States section | `framer-motion` + `AnimatePresence` | `opacity: 0, height: 0` → `opacity: 1, height: auto` | `opacity: 0, height: 0` |
| Individual state card | `framer-motion` | `opacity: 0, y: -10` → `opacity: 1, y: 0` | `opacity: 0, x: -20` |
| Single state message | `framer-motion` | `opacity: 0` → `opacity: 1` | — |
| Summary strip | `framer-motion` | `opacity: 0` → `opacity: 1` | — |

---

## 7. Dependencies

| Package | Usage |
|---|---|
| `framer-motion` | `motion.div`, `AnimatePresence` |
| `lucide-react` | `MapPin`, `Plus`, `Trash2`, `Upload`, `FileCheck`, `Info`, `AlertTriangle` |
| `@/components/ui/button` | `Button` |
| `@/components/ui/input` | `Input` |
| `@/components/ui/label` | `Label` |
| `@/components/ui/switch` | `Switch` |
| `@/components/ui/select` | `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` |

---

## 8. Component API

```ts
interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}
```

The component is a **controlled** presentational component. It does not manage its own state; all values flow through `formData` and mutations go through `updateFormData`.

---

## 9. Accessibility

- Toggle switch is linked to its label via `htmlFor` / `id="practice-toggle"`.
- File inputs are visually hidden but remain in the DOM for keyboard/screen-reader access.
- Destructive actions (remove state) use semantic color tokens (`text-destructive`).
- All required fields are marked with a red asterisk (`<span className="text-destructive">*</span>`).
