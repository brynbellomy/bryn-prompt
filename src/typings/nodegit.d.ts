

declare module 'nodegit' {
    import * as when from 'when'

    module nodegit {
        export class Repository {
            getStatus(): when.Promise<Status[]>;
            getCurrentBranch(): when.Promise<Reference>;

            static open (repoPath): when.Promise<Repository>;
        }

        export class Status {
            /** The path of the file that the status refers to */
            path(): string;
            isNew(): boolean;
            isModified(): boolean;
            isTypechange(): boolean;
            isRenamed(): boolean;
            isIgnored(): boolean;
        }

        export class Reference {
            toString(): string;
            isHead(): boolean;
        }

        export class Branch {

        }
    }

    export = nodegit
}