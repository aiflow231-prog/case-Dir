/**
 * PROHIBITED REASONING JUMPS DETECTOR
 *
 * Case Architect strictly blocks and visibly flags reasoning jumps that mistake
 * possibility or intuition for legal proof.
 */

import { ProhibitedReasoningJump } from '../types';

export const PROHIBITED_JUMPS: ProhibitedReasoningJump[] = [
  {
    id: 'JUMP_01',
    phrase: 'The draft date is automatically the filing date.',
    trigger_rule: 'Equating draft save date with statutory filing date without formal submission and receipt timestamp.',
    forensic_warning: 'VIOLATION OF PROCEDURAL RECORD: Saving a draft in an electronic portal creates only a local or server-side draft state. It does not transfer custody to the court registry or satisfy statutory filing requirements until final submission and formal registration.',
    remedy_instruction: 'Must produce official submission receipt or electronic filing audit log showing completion timestamp.'
  },
  {
    id: 'JUMP_02',
    phrase: 'The failed payment preserved the deadline.',
    trigger_rule: 'Treating an unsuccessful fee payment transaction as completing statutory filing fee obligations.',
    forensic_warning: 'JURISDICTIONAL DEFECT: An attempted payment that fails or reverses does not discharge the mandatory statutory filing fee. Filing deadlines are not tolled by declined cards or aborted payment gateway sessions unless specific statutory exception applies.',
    remedy_instruction: 'Verify if statutory grace period exists or if successful fee receipt was issued within statutory duration.'
  },
  {
    id: 'JUMP_03',
    phrase: 'No correspondence entry means no service occurred.',
    trigger_rule: 'Treating the absence of a document in one correspondence view as affirmative proof that no service ever took place.',
    forensic_warning: 'NEGATIVE INFERENCE FALLACY: The absence of an entry in a user-accessible portal does not prove service was omitted. Service may have occurred via bailiff, registered mail, SMS notification, gazette, or substituted service recorded in a separate court docket.',
    remedy_instruction: 'Inspect the primary execution or service docket directly before asserting defective service.'
  },
  {
    id: 'JUMP_04',
    phrase: 'Actual knowledge is legally identical to service.',
    trigger_rule: 'Equating a party discovering a judgment informally with statutory formal service commencing limitation periods.',
    forensic_warning: 'PROCEDURAL CONFLATION: In many procedural codes, formal service requires delivery according to statutory rules (e.g. personal, household member, postal, or gazette). Informal awareness does not automatically start the appeal clock unless the governing code explicitly specifies knowledge as the commencement event.',
    remedy_instruction: 'Check controlling procedural code to determine whether service date or knowledge date triggers the period.'
  },
  {
    id: 'JUMP_05',
    phrase: 'The registration was fraudulent.',
    trigger_rule: 'Asserting fraud or bad faith without primary forensic or documentary evidence.',
    forensic_warning: 'UNSUBSTANTIATED ACCUSATION: Fraud requires specific intentional deception and material reliance proved to high evidentiary standard. Administrative error, electronic system glitch, or unilateral assertion cannot be labeled fraud.',
    remedy_instruction: 'Reclassify as procedural irregularity or administrative discrepancy until intentional deceit is documented.'
  },
  {
    id: 'JUMP_06',
    phrase: 'Strong evidence automatically reopens a final judgment.',
    trigger_rule: 'Assuming persuasive substantive evidence overrides res judicata or final judgment bars.',
    forensic_warning: 'RES JUDICATA BAR: Once a judgment is final and unappealable, substantive evidence—no matter how convincing—cannot reopen the matter unless an extraordinary statutory reopening vehicle (e.g. petition for review based on concealed evidence) applies and its strict preconditions are satisfied.',
    remedy_instruction: 'Identify an extraordinary review vehicle and establish whether the evidence was previously unavailable.'
  },
  {
    id: 'JUMP_07',
    phrase: 'The accepted request proves defective notification.',
    trigger_rule: 'Treating a court accepting an inquiry or intake ticket as a judicial determination that notification was defective.',
    forensic_warning: 'INTAKE VS ADJUDICATION: A clerk accepting an electronic inquiry or inquiry ticket merely creates an administrative record. It is not an order, ruling, or judicial finding on the merits of service.',
    remedy_instruction: 'Distinguish intake acknowledgement from judicial determination on service validity.'
  },
  {
    id: 'JUMP_08',
    phrase: 'The appeal was refused because remote hearing was unavailable.',
    trigger_rule: 'Attributing substantive refusal to procedural video-conferencing preferences without an official rejection order.',
    forensic_warning: 'SPECULATIVE CAUSATION: Electronic hearing options are logistical channels, not grounds for appeal dismissal. A refusal requires an explicit judicial or registry decision on jurisdictional, fee, or timeliness grounds.',
    remedy_instruction: 'Retrieve the actual registry dismissal notice or refusal memo rather than guessing technological reasons.'
  },
  {
    id: 'JUMP_09',
    phrase: 'Unfairness makes the judgment void.',
    trigger_rule: 'Asserting substantive unfairness renders a judicial decision void ab initio.',
    forensic_warning: 'VOID VS VOIDABLE CONFUSION: An unfair or legally incorrect judgment rendered by a competent court is valid and binding until overturned through designated appellate channels. Voidness applies only to fundamental jurisdictional nullity.',
    remedy_instruction: 'Establish specific jurisdictional nullity grounds rather than general allegations of unfairness.'
  },
  {
    id: 'JUMP_10',
    phrase: 'A new label creates a new cause of action.',
    trigger_rule: 'Attempting to circumvent claim preclusion or time limits by renaming a rejected claim.',
    forensic_warning: 'CLAIM PRECLUSION BAR: Relabeling a previously adjudicated dispute (e.g. from breach of contract to unjust enrichment or tort) violates res judicata if the underlying transactional facts and remedy sought are identical.',
    remedy_instruction: 'Demonstrate materially distinct cause of action or genuinely new post-judgment facts.'
  },
  {
    id: 'JUMP_11',
    phrase: 'A new copy of old evidence creates a new deadline.',
    trigger_rule: 'Claiming that downloading or re-printing existing evidence resets statutory limitation clocks.',
    forensic_warning: 'LIMITATION TOLLING REJECTION: Obtaining a fresh duplicate or certified copy of a document that was previously available does not toll or restart statutory deadlines. Limitation periods run from statutory trigger events, not recent retrieval.',
    remedy_instruction: 'Ground deadline calculations strictly on the original statutory commencement event.'
  }
];

export interface JumpDetectionResult {
  detected: boolean;
  jump?: ProhibitedReasoningJump;
  matchedText?: string;
  verdict: 'BLOCKED_INVALID_REASONING' | 'CLEAN_REASONING';
}

export function detectProhibitedJump(input: string): JumpDetectionResult {
  if (!input) return { detected: false, verdict: 'CLEAN_REASONING' };

  const normalized = input.toLowerCase();

  for (const jump of PROHIBITED_JUMPS) {
    const jumpPhraseNorm = jump.phrase.toLowerCase().replace(/[.,]/g, '');
    
    // Check direct phrase or core tokens
    if (normalized.includes(jumpPhraseNorm)) {
      return { detected: true, jump, matchedText: jump.phrase, verdict: 'BLOCKED_INVALID_REASONING' };
    }

    // Keyword heuristics for jumps
    if (jump.id === 'JUMP_01' && (normalized.includes('draft date') && (normalized.includes('is the filing date') || normalized.includes('counts as filing')))) {
      return { detected: true, jump, matchedText: 'Draft date equates to filing date', verdict: 'BLOCKED_INVALID_REASONING' };
    }
    if (jump.id === 'JUMP_02' && (normalized.includes('failed payment') && (normalized.includes('preserved') || normalized.includes('tolled') || normalized.includes('satisfied fee')))) {
      return { detected: true, jump, matchedText: 'Failed payment preserved deadline', verdict: 'BLOCKED_INVALID_REASONING' };
    }
    if (jump.id === 'JUMP_03' && (normalized.includes('no correspondence') && (normalized.includes('proves no service') || normalized.includes('means no service')))) {
      return { detected: true, jump, matchedText: 'Absence of correspondence equals no service', verdict: 'BLOCKED_INVALID_REASONING' };
    }
    if (jump.id === 'JUMP_04' && (normalized.includes('actual knowledge') && (normalized.includes('identical to service') || normalized.includes('replaces formal service')))) {
      return { detected: true, jump, matchedText: 'Actual knowledge replaces formal service', verdict: 'BLOCKED_INVALID_REASONING' };
    }
    if (jump.id === 'JUMP_05' && (normalized.includes('fraudulent') || normalized.includes('forgery')) && !normalized.includes('alleged') && !normalized.includes('unproved')) {
      // If user asserts outright fraud without proof
      if (normalized.includes('registration was fraudulent') || normalized.includes('fraudulent registration')) {
        return { detected: true, jump, matchedText: 'Unproven claim of fraudulent registration', verdict: 'BLOCKED_INVALID_REASONING' };
      }
    }
    if (jump.id === 'JUMP_06' && (normalized.includes('strong evidence') && (normalized.includes('automatically reopens') || normalized.includes('overrules final judgment')))) {
      return { detected: true, jump, matchedText: 'Strong evidence overrides final judgment', verdict: 'BLOCKED_INVALID_REASONING' };
    }
  }

  return { detected: false, verdict: 'CLEAN_REASONING' };
}
