import { Lazy, Token } from "aws-cdk-lib";
import { IConstruct } from "constructs";

export interface NameResolutionInput extends UserProvidedNames {
  /**
   * Construct that this naming strategy is naming.
   * It is used as a last resort for naming.
   */
  readonly namedConstruct?: IConstruct;
  /**
   * Fallback name before we fallback to extracting name from the construct itself.
   * This might be some construct reference, such is cluster ID, stream name, and so on.
   *
   * @default - use namedConstruct to extract the name
   */
  readonly fallbackConstructName?: string;
}

export interface UserProvidedNames {
  /**
   * Human-readable name is a freeform string, used as a caption or description.
   * There are no limitations on what it can be.
   *
   * @default - use alarmFriendlyName
   */
  readonly humanReadableName?: string;
  /**
   * Plain name, used in naming alarms. This unique among other resources, and respect the AWS CDK restriction posed on alarm names.
   * The length must be 1 - 255 characters and although the validation rules are undocumented, we recommend using ASCII and hyphens.
   *
   * @default - derives name from the construct itself
   */
  readonly alarmFriendlyName?: string;

  /**
   * If this is defined, the local alarm name prefix used in naming alarms for the construct will be set to this value.
   * The length must be 1 - 255 characters and although the validation rules are undocumented, we recommend using ASCII and hyphens.
   * @see AlarmNamingStrategy for more details on alarm name prefixes
   */
  readonly localAlarmNamePrefixOverride?: string;
}

/**
 * Utility class to unify approach to naming monitoring sections.
 * @see https://docs.aws.amazon.com/cdk/latest/guide/tokens.html#tokens_lazy
 */
export class MonitoringNamingStrategy {
  protected readonly input: NameResolutionInput;

  constructor(input: NameResolutionInput) {
    this.input = input;
  }

  resolveAlarmFriendlyName(): string {
    return this.input.alarmFriendlyName ?? this.getFallbackAlarmFriendlyName();
  }

  resolveHumanReadableName(): string {
    return this.input.humanReadableName ?? this.getFallbackHumanReadableName();
  }

  static isAlarmFriendly(str: string) {
    // we do not know the exact pattern yet, but this is a safe approximation
    // also, tokens are not allowed in alarm names
    return str && !Token.isUnresolved(str) && /^[a-zA-Z0-9\-_]+$/.test(str);
  }

  private getFallbackAlarmFriendlyName() {
    if (this.input.fallbackConstructName) {
      if (
        MonitoringNamingStrategy.isAlarmFriendly(
          this.input.fallbackConstructName,
        )
      ) {
        return this.input.fallbackConstructName;
      }
    }

    if (this.input.namedConstruct) {
      const node = this.input.namedConstruct.node;
      if (MonitoringNamingStrategy.isAlarmFriendly(node.id)) {
        // scope-unique ID
        return node.id;
      }
    }

    throw new Error(
      "Insufficient information provided for naming the alarms and/or monitoring section: " +
        "Please provide alarmFriendlyName, humanReadableName, or namedConstruct as a fallback",
    );
  }

  private getFallbackHumanReadableName() {
    return Lazy.uncachedString({
      produce: (context) => {
        const resolvedName: any = context.resolve(
          this.input.fallbackConstructName,
        );
        if (
          typeof resolvedName === "string" &&
          MonitoringNamingStrategy.isNonBlank(resolvedName)
        ) {
          return resolvedName;
        }
        if (this.input.namedConstruct) {
          const node = this.input.namedConstruct.node;
          if (MonitoringNamingStrategy.isNonBlank(node.id)) {
            // scope-unique ID
            return node.id;
          }
        }
        return this.resolveAlarmFriendlyName();
      },
    });
  }

  private static isNonBlank(str: string) {
    return str && str.trim().length > 0;
  }
}
