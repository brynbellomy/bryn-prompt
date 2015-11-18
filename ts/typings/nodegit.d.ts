

declare module 'nodegit' {
    module nodegit {
        export class Repository {
            getStatus(): Promise<Status[]>;
            getCurrentBranch(): Promise<Reference>;
            getRemotes(): Promise<Remote[]>;
            getRemote(remote: string|Remote): Promise<Remote>;

            static open (repoPath): Promise<Repository>;
        }

        export class Remote {
            addFetch();
            addPush();
            autotag();
            clearRefspecs();
            connect();
            connected();
            disconnect();
            download();
            dup();
            fetch();
            free();
            getCallbacks();
            getFetchRefspecs();
            getPushRefspecs();
            getRefspec();
            name();
            owner();
            prune();
            pruneRefs();
            push();
            pushurl();
            refspecCount();
            save();
            setAutotag();
            setCallbacks();
            setPushurl();
            setUpdateFetchhead();
            setUrl();
            stats();
            stop();
            updateFetchhead();
            updateTips();
            upload();
            url();

            static create();
            static createAnonymous();
            static createWithFetchspec();
            static delete();
            static initCallbacks();
            static isValidName();
            static list();
            static lookup();
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