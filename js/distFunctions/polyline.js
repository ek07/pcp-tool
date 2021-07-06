
// def get_mean_polyline_dist(df, perm):
//     total_line_dist = 0
//     rows_in_df = len(df)
    
//     for i, dim in enumerate(perm[:-1]):
//         total_line_dist = total_line_dist + line_dist(df.iloc[:,perm[i]], df.iloc[:,perm[i+1]]).sum()

//     return total_line_dist/rows_in_df


// def line_dist(dim1, dim2):
//     linedist = np.sqrt((dim1-dim2)**2+1)
//     return linedist

